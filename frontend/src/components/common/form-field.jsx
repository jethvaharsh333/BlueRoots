const FormField = ({ label, children }) => {
    return (
        <div className="w-full flex flex-col gap-y-1">
            <div>
                <span className="text-slate-800 text-sm font-medium">{label}</span>
            </div>
            <div className="w-full px-1">
                {children}
            </div>
        </div>
    )
}

export default FormField;