# bitespeed-backend


## Live API Endpoint

The application is hosted live on Render.com at the following URL:

**Base URL:** [https://bitespeed-backend-73qk.onrender.com](https://bitespeed-backend-73qk.onrender.com)

**PostMan Collection for identify api:** `https://.postman.co/workspace/My-Workspace~a2b3f5e5-b07d-4877-8c82-627b916594ee/collection/45484138-fddc16d8-fc01-4c96-ad43-8caa00584377?action=share&creator=45484138` (contains request body with phone, with email, both with phone and emai )

**api cURL:**
```bash
curl --location 'https://bitespeed-backend-73qk.onrender.com/identify' \
--header 'Content-Type: application/json' \
--data-raw '{"email": "test@example.com", "phoneNumber": "4445556666"}'
```

---

## How to Use the `/identify` API

`/identify` API endpoint currently accepts `POST` requests and is used to identify the existing contacts

* **Endpoint:** `POST /identify`
* **Full URL:** `https://bitespeed-backend-73qk.onrender.com/identify`
* **Content-Type:** `application/json`

### Request Body

The request body should be a JSON object containing either `email`, `phoneNumber`, or both.

**Examples of Request Bodies:**

* **Only Email:**
    ```json
    {
        "email": "test@example.com"
    }
    ```
* **Only Phone Number:**
    ```json
    {
        "phoneNumber": "1234567890"
    }
    ```
* **Both Email and Phone Number:**
    ```json
    {
        "email": "another@example.com",
        "phoneNumber": "9876543210"
    }
    ```

### Response Format


```json
{
    "contact": {
        "primaryContatctId": 1,
        "emails": ["primary@example.com", "secondary1@example.com", "secondary2@example.com"],
        "phoneNumbers": ["1111111111", "2222222222"],
        "secondaryContactIds": [2, 3, 4]
    }
}