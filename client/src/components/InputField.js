import { Input } from "@material-tailwind/react";
 
export function InputDefault({label, value, onChange, placeholder, type, isDisabled}) {
  return (
    <div className="w-96">
      <Input size="lg" label={label} value={value} onChange={onChange} placeholder={placeholder} type={type} disabled={isDisabled}
      className="appearance-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"/>
    </div>
  );
}