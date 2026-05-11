declare module "swagger-ui-react" {
  import { ComponentType } from "react";

  interface SwaggerUIProps {
    spec?: Record<string, unknown>;
    url?: string;
    docExpansion?: "list" | "full" | "none";
    defaultModelsExpandDepth?: number;
    [key: string]: unknown;
  }

  const SwaggerUI: ComponentType<SwaggerUIProps>;
  export default SwaggerUI;
}
