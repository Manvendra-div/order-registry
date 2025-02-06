import { MenuType } from "@/types/menu.type";
import { doGet } from ".";

export const getMenuItems = async (): Promise<{
  data: MenuType["items"] | null;
  success: boolean;
  message: string | null;
}> => {
  try {
    const response = await doGet("/menu.json");
    return { success: true, data: response.items, message: null };
  } catch (error: any) {
    return { success: false, data: null, message: error.message };
  }
};
