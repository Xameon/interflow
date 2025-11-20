## Authorization Test Cases

### 1. Sign up
#### Expected Result
When sending a JSON object with an `username`, `email`, `password` and optional `avatarUrl`, we expect the endpoint `POST /api/auth/sign-up` to return status `201` and set http-only cookies to the Headers, which will indicate successful user creation.
#### Testing

<img width="1733" height="1126" alt="Screenshot_13" src="https://github.com/user-attachments/assets/4d46ace7-90ef-4a4a-b63e-b6093335f1d5" />

---

<img width="1722" height="1068" alt="Screenshot_14" src="https://github.com/user-attachments/assets/db4dd80c-27e9-4f7f-9504-78669910551c" />

#### Result
As we see, result is successful as we expected. Status code is `201`, also we have success message and Set-Cookies in response.

### 2. Auth
#### Expected Result
Once we have cookies, we can get information about the user, namely, we should receive the user ID from the endpoint `GET /api/auth`.
#### Testing

<img width="1739" height="1148" alt="Screenshot_15" src="https://github.com/user-attachments/assets/54d9fdc2-5c2e-449f-b91a-f83fd5d73050" />

As we see, the endpoint returned status code 200 and the user ID in the body, indicating successful operation.

### 3. Logout
#### Expected Result
After call enpoint `/api/auth/logout` cookies should be removed from headers.
#### Testing
<img width="1725" height="1128" alt="Screenshot_13" src="https://github.com/user-attachments/assets/6abfdff8-e6ac-4585-beff-fa966e965e8f" />

---

<img width="1728" height="1081" alt="Screenshot_14" src="https://github.com/user-attachments/assets/fa9c2c04-ab9d-4809-a08d-78930ccb04ff" />

After calling the logout endpoint, wee can see that the cookies have been cleared, and now the authorization endpoint returns code `401`, which indicates a successful logout.

### 4. Sign-in
#### Expected Result
Since the user we created is saved in the database, we can try to log in to the account. We expect the system to deny us access if the password is incorrect; otherwise, we'll receive a successful status code of `200` and the cookies will be set in the headers.
#### Testing

<img width="1723" height="1167" alt="Screenshot_15" src="https://github.com/user-attachments/assets/30afa423-a124-4402-aa83-115571a09098" />

---

<img width="1720" height="1107" alt="Screenshot_16" src="https://github.com/user-attachments/assets/eaac36dc-cd01-4863-ada6-4258a6aeff45" />

---

<img width="1733" height="1051" alt="Screenshot_17" src="https://github.com/user-attachments/assets/4d59c366-29c3-4e75-a942-2ffac02ebb5c" />

The screenshots show that when we enter an incorrect password, the system does not let us in, but with the correct password everything is fine, and cookies are set in the headers.

## Conclusions
We see that our authorization API successfully copes with its tasks.
