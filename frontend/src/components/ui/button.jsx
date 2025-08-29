import { motion } from "framer-motion";
import clsx from "clsx";

export const Button = ({ children, className, type, disabled, ...rest }) => {
    return (
        <motion.button
            type={type}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.95 }}
            animate={{ opacity: 1 }}
            initial={{ opacity: 0 }}
            transition={{ type: "tween", duration: 0.2, ease: "easeOut" }}
            className={clsx(
                "p-2 flex justify-center rounded-md cursor-pointer transition-all",
                className,
                disabled && "opacity-50 cursor-not-allowed"
            )}
            {...rest}
        >
            {children}
        </motion.button>
    )
}