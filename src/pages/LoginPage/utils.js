import axios from "axios";
import { API_URL } from "../../components/Config";
import "../LoginPage/LoginPage.css"

const Login = async (e, navigate) => {
  e.preventDefault();
  const login_url = `${API_URL}/user/login`;
  const mobileno = e.target["mobileno"].value;
  const password = e.target["password"].value;
  console.log("mobileno",mobileno.length)
  console.log("password",password)

  if (mobileno.length <= 10) {
    <div  style={{display:'block',alignItems:'center', cursor:'pointer',background:"red",color:"green"}}>ritika </div>
  }
  if (password.length <= 8) {
    console.log("garg ritika")
    
  }

  await axios.post(login_url, { mobileno, password })
    .then((res) => {
      if (res.data.data.verified) {
        localStorage.setItem("token", JSON.stringify(res.data.data.token));
        navigate("/dashboard");
      }
       //else alert("Some error occurred");
    })
    .catch((err) => {
      console.log(err)
      // return alert(err.response?.data?.error);
    });
};

export { Login };
