//Components
//import ButtonBigNoIconPrimary from "../buttons/big-no-icon/ButtonBigNoIconPrimary";
//import ButtonBigNoIconSecondary from "../buttons/big-no-icon/ButtonBigNoIconSecondary";
//Redux
import { useSelector } from "react-redux";
//import { selectGeneral } from "../../features/general/generalSlice";

export default function ModalBackground({
  editing,
  width,
  gap,
  rounded,
  title,
  children,
  secondaryButtonText,
  primaryButtonText,
  secondarySetter,
  primarySetter,
  secondaryDisabled,
  primaryDisabled,
  primaryFetching,
  inlineInfo,
}) {
  //Redux
  const general = useSelector(false);

  return (
    <div
      className={`fixed w-screen z-30 h-screen top-0 left-0 px-2 bg-uktena-dark-transparent flex justify-center items-center`}
    >
      <div
        className={`bg-uktena-white ${width ? width : "w-full lg:w-[450px]"}  ${
          rounded ? rounded : "rounded-[24px] "
        } p-4 lg:p-6 flex flex-col ${gap ? gap : "gap-5"} ${
          general ? "lg:ml-20" : "md:ml-60"
        } text-uktena-dark-neutro`}
      >
        <div
          className={`${
            inlineInfo && "flex justify-between border-b border-uktena-01 pb-2"
          }`}
        >
          <h2 className="text-lg  font-semibold">{title}</h2>
          <p className="text-base font-semibold">{inlineInfo && inlineInfo}</p>
        </div>
        {children}
        <div
          className={`flex gap-2 lg:justify-end ${
            !inlineInfo && " border-t border-uktena-01"
          } pt-2`}
        >
          <ButtonBigNoIconSecondary
            text={secondaryButtonText}
            width="w-full lg:max-w-[175px]"
            setter={secondarySetter}
            disabled={secondaryDisabled}
          />
          {editing && (
            <ButtonBigNoIconPrimary
              text={primaryButtonText}
              width="w-full lg:max-w-[175px]"
              setter={primarySetter}
              disabled={primaryDisabled}
              fetching={primaryFetching}
            />
          )}
        </div>
      </div>
    </div>
  );
}
