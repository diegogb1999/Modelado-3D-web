import CircleLoader from "./CircleLoader";
 
export default function ButtonSmallNoIconPrimary({
  text,
  disabled,
  setter,
  fetching,
  width,
  helpWindow,
}) {
  return (
<button
      onClick={setter}
      disabled={disabled}
      className={`${
        helpWindow &&
        "outline outline-offset-0 outline-2 outline-uktena-red transition-none"
      } ${width ? width : "w-full"} bg-uktena-violet text-uktena-white border-uktena-violet flex justify-center items-center shadow-uktena-shade border transition-all rounded-[24px] py-[10px] px-[30px] gap-1 h-[35px] hover:bg-uktena-dark-violet hover:border-uktena-dark-violet`}
>
      {fetching ? <CircleLoader /> : text}
</button>
  );
}