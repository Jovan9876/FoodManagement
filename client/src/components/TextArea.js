import { Textarea } from "@material-tailwind/react";
 
export function TextareaSizes({label, value, onChange, placeholder}) {
  return (
    <div className="w-auto gap-6">
      {/* <Textarea size="md" label="Textarea Medium" /> */}
      <Textarea size="lg" label={label} value={value} onChange={onChange} placeholder={placeholder}/>
    </div>
  );
}