import Image from "next/image";


let login_url="http://localhost:3000/login";
let register_url="http://localhost:3000/register";



export default function Home() {
  return (
    <>
    <div id='body' className="grid grid-rows-[1fr_1fr_1fr] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)] bg-blue-300 bg-cover bg-center bg-no-repeat">
      
        <h1 className="text-6xl text-center">Welcome to Job Portal</h1>


        <a href={register_url} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Register</a>            
        <div className="text-3xl font-bold text-center">
          <p> New user then click on register </p> 
        </div>  
         <a href={login_url} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Login</a>
         <div className="text-3xl font-bold text-center">
          <p>  Hii , user  click on Login </p> 
        </div>
          
         
    </div>
    
    </>
  );
}
