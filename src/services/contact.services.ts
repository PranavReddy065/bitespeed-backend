import { Contact, LinkPrecedence, PrismaClient } from '../generated/prisma'; 

const prisma = new PrismaClient();

    interface ConsolidatedContact {
        primaryContatctId: number;
        emails: string[];
        phoneNumbers: string[];
        secondaryContactIds: number[];
    }

    export const identifyContactService = async (email?: string, phoneNumber?: string): Promise<ConsolidatedContact> => {
        const matchingContacts = await prisma.contact.findMany({
            where: {
                OR: [
                    email ? { email: email } : {},
                    phoneNumber ? { phoneNumber: phoneNumber } : {},
                ].filter(obj => Object.keys(obj).length > 0),
                deletedAt: null,
            },
            orderBy: {
                createdAt: 'asc',
            },
        });

        if (matchingContacts.length === 0) {
            const newContact = await prisma.contact.create({
                data: {
                    email,
                    phoneNumber,
                    linkPrecedence: LinkPrecedence.primary,
                },
            });

            return {
                primaryContatctId: newContact.id,
                emails: newContact.email ? [newContact.email] : [],
                phoneNumbers: newContact.phoneNumber ? [newContact.phoneNumber] : [],
                secondaryContactIds: [],
            };
        }

        let ultimatePrimaryContact: Contact = matchingContacts[0];

        for (const contact of matchingContacts) {
            let currentContactPrimary: Contact = contact;
            if (contact.linkPrecedence === LinkPrecedence.secondary && contact.linkedId) {
                const linkedPrimary = await prisma.contact.findUnique({
                    where: { id: contact.linkedId },
                });
                if (linkedPrimary) {
                    currentContactPrimary = linkedPrimary;
                }
            }

            if (currentContactPrimary.createdAt < ultimatePrimaryContact.createdAt) {
                ultimatePrimaryContact = currentContactPrimary;
            }
        }

        const allRelatedContacts = await prisma.contact.findMany({
            where: {
                OR: [
                    { id: ultimatePrimaryContact.id },
                    { linkedId: ultimatePrimaryContact.id },
                    ultimatePrimaryContact.email ? { email: ultimatePrimaryContact.email } : {},
                    ultimatePrimaryContact.phoneNumber ? { phoneNumber: ultimatePrimaryContact.phoneNumber } : {},
                ].filter(obj => Object.keys(obj).length > 0),
                deletedAt: null,
            },
            orderBy: { createdAt: 'asc' },
        });

        const emailsSet = new Set<string>();
        const phoneNumbersSet = new Set<string>();
        const secondaryIdsSet = new Set<number>();

        for (const contact of allRelatedContacts) {
            if (contact.email) emailsSet.add(contact.email);
            if (contact.phoneNumber) phoneNumbersSet.add(contact.phoneNumber);

            if (contact.id !== ultimatePrimaryContact.id) {
                secondaryIdsSet.add(contact.id);
            }
        }

        const isIncomingEmailNew = email && !emailsSet.has(email);
        const isIncomingPhoneNumberNew = phoneNumber && !phoneNumbersSet.has(phoneNumber);

        if (isIncomingEmailNew || isIncomingPhoneNumberNew) {
            const newSecondaryContact = await prisma.contact.create({
                data: {
                    email,
                    phoneNumber,
                    linkPrecedence: LinkPrecedence.secondary,
                    linkedId: ultimatePrimaryContact.id,
                },
            });
            if (newSecondaryContact.email) emailsSet.add(newSecondaryContact.email);
            if (newSecondaryContact.phoneNumber) phoneNumbersSet.add(newSecondaryContact.phoneNumber);
            secondaryIdsSet.add(newSecondaryContact.id);
        }

        for (const contact of allRelatedContacts) {
            if (contact.id === ultimatePrimaryContact.id) continue;

            if (contact.linkPrecedence === LinkPrecedence.primary) {
                await prisma.contact.update({
                    where: { id: contact.id },
                    data: {
                        linkedId: ultimatePrimaryContact.id,
                        linkPrecedence: LinkPrecedence.secondary,
                        updatedAt: new Date(),
                    },
                });
                secondaryIdsSet.add(contact.id);
            } else if (contact.linkPrecedence === LinkPrecedence.secondary && contact.linkedId !== ultimatePrimaryContact.id) {
                await prisma.contact.update({
                    where: { id: contact.id },
                    data: {
                        linkedId: ultimatePrimaryContact.id,
                        updatedAt: new Date(),
                    },
                });
                secondaryIdsSet.add(contact.id);
            }
        }

        const finalConsolidatedContacts = await prisma.contact.findMany({
            where: {
                OR: [
                    { id: ultimatePrimaryContact.id },
                    { linkedId: ultimatePrimaryContact.id },
                ].filter(obj => Object.keys(obj).length > 0),
                deletedAt: null,
            },
            orderBy: { createdAt: 'asc' },
        });

        const responseEmails: string[] = [];
        const responsePhoneNumbers: string[] = [];
        const finalSecondaryContactIds: number[] = [];

        if (ultimatePrimaryContact.email) {
            responseEmails.push(ultimatePrimaryContact.email);
        }
        if (ultimatePrimaryContact.phoneNumber) {
            responsePhoneNumbers.push(ultimatePrimaryContact.phoneNumber);
        }

        for (const contact of finalConsolidatedContacts) {
            if (contact.id === ultimatePrimaryContact.id) continue;

            if (contact.email && !responseEmails.includes(contact.email)) {
                responseEmails.push(contact.email);
            }
            if (contact.phoneNumber && !responsePhoneNumbers.includes(contact.phoneNumber)) {
                responsePhoneNumbers.push(contact.phoneNumber);
            }
            finalSecondaryContactIds.push(contact.id);
        }

        if (isIncomingEmailNew && email && !responseEmails.includes(email)) {
            responseEmails.push(email);
        }
        if (isIncomingPhoneNumberNew && phoneNumber && !responsePhoneNumbers.includes(phoneNumber)) {
            responsePhoneNumbers.push(phoneNumber);
        }

        return {
            primaryContatctId: ultimatePrimaryContact.id,
            emails: responseEmails.filter(Boolean),
            phoneNumbers: responsePhoneNumbers.filter(Boolean),
            secondaryContactIds: finalSecondaryContactIds.sort((a, b) => a - b),
        };
    };