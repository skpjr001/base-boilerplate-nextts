import React from "react";

interface UsernameInputProps extends React.ComponentPropsWithRef<"input"> {
  label?: string;
}

/**
 * @deprecated Use <TextField addOnLeading={}> to achieve the same effect.
 */
const UsernameInput = React.forwardRef<HTMLInputElement, UsernameInputProps>((props, ref) => (
  // todo, check if username is already taken here?
  <div>
    <label htmlFor="username" className="block text-sm font-medium text-gray-700">
      {props.label ? props.label : "Username"}
    </label>
    <div className="flex mt-1 rounded-md shadow-sm">
      <span className="inline-flex items-center px-3 text-gray-500 border border-r-0 border-gray-300 rounded-l-sm bg-gray-50 sm:text-sm">
        {process.env.NEXT_PUBLIC_APP_URL}/{props.label && "team/"}
      </span>
      <input
        ref={ref}
        type="text"
        name="username"
        id="username"
        autoComplete="username"
        required
        {...props}
        className="flex-grow block w-full min-w-0 lowercase border-gray-300 rounded-none rounded-r-sm focus:ring-black focus:border-brand sm:text-sm"
      />
    </div>
  </div>
));

UsernameInput.displayName = "UsernameInput";

export { UsernameInput };
