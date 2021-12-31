# Task Kanban


![Chat application built using react and firebase](https://user-images.githubusercontent.com/56753745/147792602-749a78ee-a203-44d6-8794-a76c4ef57b0d.png)


My goal for building this application was create a simple tool that I can use to track tasks across my projects. The complete project can be found here [Task Kanban](https://taskkanban.vercel.app/)

* I recorded tasks and each feature for the application in this google doc. [Tasks and Requirement Specification](https://docs.google.com/document/d/1qnkFSptPxbciwIefz63EZW_UKzjGBkB-16gzKRi6PBE/edit). 


* For the design, I used this design from figma. [Application Design](https://www.figma.com/file/Lbz1HSB8JtKrDPbNY3Mr1F/Kanban-Board---Light-%2F-Dark-mode-(Community)?node-id=6%3A0)


* The following sample account can be used to access the application

**Email:** smith@taskkanban.com
**Password:** 123456

# Tech Stack 
1. React for the frontend 
2. Firebase for the backend 
3. Context API for state management 
4. CSS modules for styling
5. Firebase Cloud Storage for Storage
6. Vercel for hosting

My choice to use react's context API for this project presented caching challenges, which caused to abandon this feature altogether. However, I am going to rewrite the application with Typescript and React Query, which will allow me better tools for caching. The reason I am deeply invested in caching is that I do not think the data will change very much during daily usage for most users. Therefore, caching will help improve performance and the overall user experience. 


# Additional Features 
With additional time, I will add a teams feature, which will improve the overall functionality of the application. I am also currently writing unit tests for each of the components, with integration tests to come later. 

# Available Scripts (Adopted from Create React App)
In the project directory, you can run:

`npm start`
Runs the app in the development mode.
Open http://localhost:3000 to view it in the browser.

`npm run build`
Builds the app for production to the build folder.
It correctly bundles React in production mode and optimizes the build for the best performance.

