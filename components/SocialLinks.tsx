import { type SocialNetwork, socials } from "@/lib/site-data";

const iconProps = {
  width: 20,
  height: 20,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  "aria-hidden": true,
  focusable: false,
} as const;

const icons: Record<SocialNetwork, React.ReactNode> = {
  facebook: (
    <svg {...iconProps}>
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  ),
  instagram: (
    <svg {...iconProps}>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.6" fill="currentColor" />
    </svg>
  ),
  tiktok: (
    <svg {...iconProps}>
      <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
    </svg>
  ),
};

export function SocialIcon({ network }: { network: SocialNetwork }) {
  return icons[network];
}

type SocialLinksProps = {
  /**
   * "compact": icon + account name (footer).
   * "list": icon + account name with the handle beneath (contact page).
   */
  variant?: "compact" | "list";
  className?: string;
};

export function SocialLinks({ variant = "compact", className = "" }: SocialLinksProps) {
  if (socials.length === 0) return null;

  return (
    <ul className={`social-links social-links--${variant} ${className}`.trim()}>
      {socials.map((social) => (
        <li key={social.id}>
          <a
            href={social.href}
            target="_blank"
            rel="noopener noreferrer me"
            aria-label={`Sky Beach on ${social.name}: ${social.handle} (opens in a new tab)`}
          >
            {icons[social.network]}
            {variant === "list" ? (
              <span>
                <strong>{social.name}</strong>
                <small>{social.handle}</small>
              </span>
            ) : (
              <span>{social.name}</span>
            )}
          </a>
        </li>
      ))}
    </ul>
  );
}
