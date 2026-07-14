import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "../../lib/queryKeys";
import {
  createMenuItem,
  getMenu,
  updateMenuAvailability,
} from "../../services/menuService";

export function useMenu() {
  return useQuery({
    queryKey: queryKeys.menu(),
    queryFn: ({ signal }) => getMenu(signal),
  });
}

export function useMenuItem(menuItemId: number) {
  return useQuery({
    enabled: Number.isFinite(menuItemId) && menuItemId > 0,
    queryKey: queryKeys.menuItem(menuItemId),
    queryFn: async ({ signal }) => {
      const menu = await getMenu(signal);
      return menu.find((item) => item.id === menuItemId) ?? null;
    },
  });
}

export function useCreateMenuItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createMenuItem,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.menu() });
    },
  });
}

export function useUpdateMenuAvailability() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      isAvailable,
      menuItemId,
    }: {
      menuItemId: number;
      isAvailable: boolean;
    }) =>
      updateMenuAvailability(menuItemId, {
        is_available: isAvailable,
      }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.menu() });
    },
  });
}
