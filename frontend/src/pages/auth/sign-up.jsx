import { motion, AnimatePresence } from "framer-motion";
import AuthCard from "../../components/auth/auth-card.jsx";
import SignUpForm from "../../components/auth/signup-form.jsx";
import LayoutAuth from "./layout-auth.jsx";

// Animation presets for AuthCard
const cardVariants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.6, ease: "easeOut" } },
};

const SignUp = () => {
  return (
    <LayoutAuth>
      <motion.div
        initial="hidden"
        animate="visible"
        exit="hidden"
        variants={cardVariants}
      >
        <AuthCard
          title="Sign Up"
          label="Create an account"
          backButtonLabel="Already have an account?"
          backButtonName="Login"
          backButtonLink="/login"
          isSSO="true"
        >
          <div className="mt-5 w-full">
            <SignUpForm />
          </div>
        </AuthCard>
      </motion.div>
    </LayoutAuth>
  );
};

export default SignUp;
