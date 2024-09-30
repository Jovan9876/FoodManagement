import { Input } from "@material-tailwind/react";
 
export function InputDefault({label, value, onChange}) {
  return (
    <div className="w-96">
      <Input size="lg" label={label} value={value} onChange={onChange}/>
    </div>
  );
}