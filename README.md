# React Firebase Chat Application


![Chat application built using react and firebase](https://user-images.githubusercontent.com/56753745/147792602-749a78ee-a203-44d6-8794-a76c4ef57b0d.png)


My goal for building this application was create a simple tool that I can use to track tasks across my projects. The complete project can be found here [Task Kanban](https://taskkanban.vercel.app/)

* I recorded tasks and each feature for the application in this google doc. [Tasks and Requirement Specification](https://docs.google.com/document/d/1qnkFSptPxbciwIefz63EZW_UKzjGBkB-16gzKRi6PBE/edit). 


* For the design, I used this design from figma. [Application Design](https://www.figma.com/file/Lbz1HSB8JtKrDPbNY3Mr1F/Kanban-Board---Light-%2F-Dark-mode-(Community)?node-id=6%3A0)


* The following are sample accounts that can be used to access the application

Email: smith@taskkanban.com
Password: 123456

# Tech Stack 
1. React for the frontend 
2. Firebase for the backend 
3. Context API for state management 
4. CSS modules for styling
5. Firebase Cloud Storage for Storage
6. Vercel for hosting

I decided to use Context API because the application does not require complex state handling and does not have caching functionality. In terms of the backend, I considered using Node.js and Socket.IO, but my deeper familiarity with firebase meant that I could get the project up and running quicker. Besides, the Realtime Database offered plenty of features off the box; hence, there was no need to go with a custom solution. 

Finally, I opted to use React because I its component driven architecture significantly improves the process building and maintaining web applications. Using react with CSS modules allowed me to develop parts of the application quickly and in isolation.

# Additional Features 
If I had more time I would have incorporated more features, such as group chats and friends. 

# Available Scripts (Adopted from Create React App)
In the project directory, you can run:

`npm start`
Runs the app in the development mode.
Open http://localhost:3000 to view it in the browser.

`npm run build`
Builds the app for production to the build folder.
It correctly bundles React in production mode and optimizes the build for the best performance.

