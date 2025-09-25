# Technical Specification (TS)

**Product:** Social Network for Interest-Based Communities

---

## 1. Purpose and Goals

The purpose of this product is to create a social networking platform that connects people through their interests and hobbies.  
The main goals are:

- Provide a space for users to discover and join communities.
- Enable interaction through content sharing, discussions.
- Facilitate both online and offline connections among people with similar hobbies.
- Build a safe and user-friendly environment for collaboration and knowledge sharing.

---

## 2. General Requirements

### Functional Requirements

1. Users can register, create a profile.
2. Guests (non-registered users) can browse content but cannot interact with it.
3. Authorized users can:
   - Post, edit, and delete their own content.
   - Like and comment on posts.
   - Join or create communities.
   - Follow or unfollow other users and communities.
4. The system recommends communities and users based on subscriptions.
5. Community owners can manage membership and publishing rights.

### Non-Functional Requirements

1. **Performance:** Support up to 1000 concurrent users.
2. **Security:** Store sensitive user data in encrypted form.
3. **Scalability:** System architecture must allow easy feature expansion.
4. **Availability:** Minimum uptime of 99.5% annually.
5. **Usability:** Provide a simple, intuitive interface accessible from both web and mobile.

---

## 3. Constraints

- Must be accessible via **web browsers (desktop & mobile)** and **mobile apps (iOS/Android)**.
- Development should use modern frameworks (e.g. Next.js).
- Database: relational (e.g., PostgreSQL).
- Integration with external APIs (e.g., Firebase for Image Storage) should be considered.

---

## 4. Expected Results

- A functional MVP (Minimum Viable Product) that allows users to:
  - Register/login and manage profiles.
  - Browse, create, and interact with content and communities.
- A scalable platform ready for further development and feature expansion.
- User-friendly design encouraging engagement and long-term retention.

---

## 5. Future

- Create an admin panel and complaint system to improve protection against shocking content
- Create two-factor authentication, also known as Oauth authentication
- Add streaming services
- Add community promotion and analytics
