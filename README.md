
# HiGuys App 2024

---

GIT REPO:    https://github.com/Javascript-Final/JS-REACT-APP-FINAL.git

---


## Project Description


**The collab messenger app is a modern solution for people and teams in need of a real-time solution for communication and collaboration. It allows users to share information, link resources and potentially discuss ideas over voice and video.**

---

### Functional Requirements

**Entities**


 1. Authentication is handled by Firebase, there is no need for auth entity

 2. Each user must have a username, email, phone number and a photo.

 * Username must be unique and have between 5 and 35 symbols.

 * Email must be valid email and unique in the system.

 * A user could be in more than one team.

 3. Channels must have an id, title, and a list of participants.

 * Title must be between 3 and 40 symbols.

 * A channel should have at least one user (participant).

 * Channels could be public or private.

4. Teams must have an id, name, owner, list of team members, list channels

* Name must be unique and between 3 and 40 symbols.

  ---


**Public Part**


* The public part must be accessible without authentication i.e., for anonymous users.

* The public part provides register functionality Login form (must) used to authenticate a user using username and password.

* The public (landing) page could have information about the total number of active users/teams.

**Private part**


**Accessible only if the user is authenticated.**

* Registered users must have a private area accessible after successful login, where they can see all the channels (or chats) they have been added to.

* Individual user requirements:

* Users must be able to see and edit their personal information – name, avatar picture, etc.

* Users should be able to search for other users by their name, team(s) they belong to, and/or email.

* Users could have a status (online/offline/busy/away/in a meeting).

  ---
  

**Team requirements:**


* A team must be created by a user and that user must be the team’s owner.

* One user should be able to be added to multiple teams.

* Only the team’s owner should be able to add to or remove other users from the team.

* A team could have its own page/view where information about the team could be visible, and all team’s channels are displayed together.

* Users could be able to organize team meetings with a starting date and hour and a specified duration.

 ---

**Channel (chat) requirements:**

* A single user must be able create a chat (with unrelated users) or a channel (with their own team).

* Users must be able to leave any chat and channel they have been added to. Upon leaving they should stop receiving new messages from that chat/channel.

* Every chat/channel should contain all the messages sent in it and display the messages in chronological order.

* Users could be able to react to individual messages.

* Users could be able to edit their last sent message. Changes should propagate to all other users seeing the chat/channel.

* Messages could contain media such as static pictures and/or gifs, or the client could have integration with 3rd party services such as Giphy.

 ---

**Meetings (Optional Requirement)**


**Users could organize meetings with other users when they can talk over voice and/or video. Meeting have specified date, hour and duration, and a list of participants**

* Meetings could track when and how long each participant stayed in the meeting and generate a report upon the meeting’s end.

* Users in meetings could be displayed in a gallery (if and when camera access is implemented).

* Meetings could have their own chat that persists after the end of the meeting.

 ---


**Other Optional features**

**Email Verification – In order for the registration to be completed, the user must verify their email by clicking on a link sent to their email by the application. Before verifying their email, users cannot make work items or make reviews.**

**Meeting notes – Users could enter notes in a specialized view during the meeting and those notes could persist.**

**Meeting recordings – The meeting could be recorded in video format and could be uploaded to Firebase Storage where it could be made available to all meeting participants.**

**Desktop app – The client could be implemented as a desktop application with tools such as Electron or NW.js.**

**Easter eggs – Creativity is always welcome and appreciated. Find a way to add something fun and/or interesting, maybe an Easter egg or two to your project to add some variety.**

---

**You could use external libraries like Redux or Zustand for state management.**

* You could use Typescript.

* Firebase Realtime Database

**All data should be stored in the document (NoSQL) database hosted by Google Firebase. You must think of a way to organize your documents to achieve the functionalities described above.**

---

**Technical Requirements**

* General · Follow KISS, SOLID, DRY principles when coding

* Follow the principles of functional programming wherever applicable

* Use tiered project structure (separate the application in layers, if applicable)

* You should implement proper exception handling and propagation

* Try to think ahead. When developing something, think – “How hard would it be to change/modify this later?”

  ---


**Git**

**Commits in the GitHub repository should give a good overview of how the project was developed, which features were created first and the people who contributed. Contributions from all team members must be evident through the git commit history! The repository must contain the complete application source code and any scripts (database scripts, for example).**

---


**Provide a link to a GiitHub repository with the following information in the README.md file:**

* Project description

* Link to the hosted project (if hosted online)

* Instructions how to setup and run the project locally
  

**Optional Requirements**


**Besides all requirements marked as should and could, here are some more optional requirements:**

* Use branches while working with Git.

* Host you application with Firebase Hosting or any other hosting service

