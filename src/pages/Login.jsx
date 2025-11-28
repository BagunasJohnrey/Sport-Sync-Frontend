import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { users } from "../mockData";
import { useAuth } from "../context/AuthContext";
import background from "../assets/background.png";
import logo from "../assets/logo.png";
import { Eye, EyeOff, User, Lock } from "lucide-react";


export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();

    const foundUser = users.find(
      (u) => u.username === username && u.password === password
    );

    if (!foundUser) {
      setError("Invalid username or password.");
      return;
    }

    if (foundUser.status !== "Active") {
      setError("Your account is inactive.");
      return;
    }

    login(foundUser);

    localStorage.setItem("role", foundUser.role);

    navigate("/dashboard");
  };

  return (
    <div
      className="
    min-h-screen flex items-center justify-center 
    bg-cover bg-center p-6 sm:p-8 md:p-10 lg:p-12
  "
      style={{ backgroundImage: `url(${background})` }}
    >
      <div
        className="
      w-full 
      max-w-sm sm:max-w-md lg:max-w-lg 
      bg-softWhite p-6 sm:p-8 md:p-10 
      rounded-xl shadow-lg flex flex-col items-center
    "
      >
        <img src={logo} className="w-24 sm:w-28 md:w-32 lg:w-36 h-auto mb-4" />

        <h1
          className="
      text-xl sm:text-2xl lg:text-3xl 
      font-heading font-bold text-deepBlue text-center mb-6
    "
        >
          Welcome to Sport Sync
        </h1>

        <form onSubmit={handleLogin} className="flex flex-col gap-4 w-full">
          {/* Username */}
<div className="relative">
  <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slateGray" size={20} />

  <input
    type="text"
    required
    className="
      w-full pl-10 p-3 border border-lightGray rounded-lg
      focus:outline-none focus:ring-2 focus:ring-deepBlue
    "
    placeholder="Enter username"
    value={username}
    onChange={(e) => setUsername(e.target.value)}
  />
</div>



          {/* Password */}
<div className="relative">
  <Lock size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-slateGray" />

  <input
    type={showPassword ? "text" : "password"}
    required
    className="
      w-full pl-10 p-3 pr-10 border border-lightGray rounded-lg
      focus:outline-none focus:ring-2 focus:ring-deepBlue
    "
    placeholder="Enter password"
    value={password}
    onChange={(e) => setPassword(e.target.value)}
  />

  {password.length > 0 && (
    <button
      type="button"
      className="absolute right-3 top-1/2 -translate-y-1/2 text-slateGray"
      onClick={() => setShowPassword(!showPassword)}
      tabIndex={-1}
    >
      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
    </button>
  )}
</div>



          {error && (
            <p className="text-crimsonRed text-center mb-2 text-sm">{error}</p>
          )}

          {/* Submit */}
          <button
            type="submit"
            className="
          w-full bg-deepBlue text-softWhite py-3 rounded-lg font-button
          hover:bg-navyBlue transition
        "
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}
