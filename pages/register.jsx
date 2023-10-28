import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

export default function Register(){
    const router = useRouter()
    const [username,setUsername] = useState("")
    const [password,setPassword] = useState("")
    const [newPassword,setNewPassword] = useState('')

    const [auth,setAuth]=useState(false)
    
    useEffect(()=>{
        let isauth;
        if (typeof window !== 'undefined'){
             isauth = window.sessionStorage.getItem("isauth");
        }
        if(isauth=="true"){
            setAuth(true)
        }else{
            setAuth(false)
        }
    },[])
    const handleSubmit = async (e) => {
        e.preventDefault();

        if(!username || !password || !newPassword){
            alert("some fields is empty !!!!")
            return
        }
        if(password!==newPassword){
            alert("password incorrect !!!")
            return;
        }

        try{
             fetch("/api/addUser",{
                method:"POST",
                headers:{
                    "Content-type":"application/json",
                },
                body:JSON.stringify({ username,password,newPassword })
                }).then(async(res)=>{
                    const data = await res.json()
                    if(res.status!==200){
                        alert(data.message)
                        return
                    }else{
                        alert(data.message)
                        router.push('/login')
                    }
                }).catch((err)=>console.log(err));
        }catch(err){
            console.log(err)
        }

       

    }

    if(!auth){
        return(
            <>
                <div className="container">
                    <form onSubmit={handleSubmit}>
        
                        <input
                          type="text"
                          placeholder="username" 
                          value={username}
                          onChange={(e)=>setUsername(e.target.value)}/>
                          <input
                          type="password"
                          placeholder="Password"
                          value={password}
                          onChange={(e)=>setPassword(e.target.value)}
                          />
                        <input
                          type="password"
                          placeholder="Repeat Password"
                          value={newPassword}
                          onChange={(e)=>setNewPassword(e.target.value)}
                          />
                          <button
                            type="submit"
                          >Register</button>
                    </form>
                    <a href="/login">Login</a>

                </div>
        
            </>
            )
    }else{
        return (
            <>
            you are already login , comeback to <a href="/home">home</a> page
            </>
        ); 
    }
   
}