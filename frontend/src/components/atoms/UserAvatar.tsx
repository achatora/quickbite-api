import { UserRound } from "lucide-react";
import type { SessionUser } from "../../types";
import { getUserAvatarUrl } from "../../utils/media";
import { getUserInitials } from "../../utils/user";

interface UserAvatarProps {
  className?: string;
  imageClassName?: string;
  sizeClassName?: string;
  user: SessionUser | null;
}

export function UserAvatar({
  className = "",
  imageClassName = "",
  sizeClassName = "size-11",
  user,
}: UserAvatarProps) {
  const avatarUrl = getUserAvatarUrl(user);
  const initials = getUserInitials(user);

  return (
    <div
      aria-hidden
      className={`relative overflow-hidden rounded-full bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.88),transparent_38%),linear-gradient(135deg,#325B24,#193316)] text-cream-soft shadow-soft ${sizeClassName} ${className}`}
    >
      {avatarUrl ? (
        <img
          alt=""
          className={`h-full w-full object-cover ${imageClassName}`}
          src={avatarUrl}
        />
      ) : initials ? (
        <span className="grid h-full w-full place-items-center text-sm font-semibold uppercase tracking-[0.12em]">
          {initials}
        </span>
      ) : (
        <span className="grid h-full w-full place-items-center">
          <UserRound className="size-5" />
        </span>
      )}
    </div>
  );
}
