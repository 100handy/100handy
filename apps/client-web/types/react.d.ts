import "react";

declare module "react" {
    // Fix for React 19 type compatibility with libraries
    // eslint-disable-next-line @typescript-eslint/no-empty-object-type
    interface DO_NOT_USE_OR_YOU_WILL_BE_FIRED_EXPERIMENTAL_REACT_NODES { }
}
