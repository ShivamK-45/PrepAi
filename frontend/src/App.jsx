import { RouterProvider } from "react-router"
import { router } from "./app.router.jsx"
import { AuthProvider } from "./features/auth/auth.context.jsx"
import { InterviewProvider } from "./features/interview/interview.context.jsx"



function App() {

  return (
    <AuthProvider> 
      <InterviewProvider>
        <RouterProvider router={router} />
      </InterviewProvider>
    </AuthProvider>
  )

  
}

export default App;

// import React from 'react';
// import { BrowserRouter } from 'react-router';
// import Sidebar from './components/layout/Sidebar';
// import MockSetup from './features/mockInterview/pages/MockSetup';
// import LiveInterview from './features/mockInterview/pages/LiveInterview';
// import MockResults from './features/mockInterview/pages/MockResults';

// function App() {
//   return (
//     <BrowserRouter>
//       <MockResults />
//     </BrowserRouter>
//   );
// }

// export default App;