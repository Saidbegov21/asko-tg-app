// types/telegram.d.ts
export {};

declare global {
  interface Window {
    Telegram?: {
      WebApp: {
        ready: () => void;
        expand: () => void;
        close: () => void;
        showPopup: (params: {
          title?: string;
          message: string;
          buttons?: any[];
        }) => void;
        initData: string;
        initDataUnsafe: {
          user?: {
            id: number;
            first_name: string;
            last_name?: string;
            username?: string;
            language_code?: string;
            is_premium?: boolean;
          };
        };
        colorScheme: "light" | "dark";
      };
    };
  }
}
