---
title: Use Case Diagram - Соціальна мережа за інтересами
---

usecaseDiagram
actor "Guest (unauthorized)" as Guest
actor "User (authorized)" as User

    Guest --> (View Posts)
    Guest --> (View Comments)
    Guest --> (View Communities)
    Guest --> (Search Users or Communities)
    Guest --> (Auth)

    User --> (Like Posts)
    User --> (Comment Posts)
    User --> (Create Posts)
    User --> (Edit own Posts)
    User --> (Delete own Posts)
    User --> (Subscribe/Unsubscribe to Users or Communities)
    User --> (Create Communities)
    User --> (Edit own Communities)
    User --> (Delete own Communities)
    User --> (Post's in Communities [if allowed by owner])

    note right of Guest
        Opportunities without authorization:
        - Content View
        - Searching
    end note

    note right of User
        Additional opportunities after authorization:
        - Interaction with content
        - Control own content
        - Communities control
    end note
