import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Eye, EyeOff } from "lucide-react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { Button } from "../../components/atoms/Button";
import { PageShell } from "../../components/layouts/PageShell";
import { ProductImageFallback } from "../../components/molecules/ProductImageFallback";
import { StateMessage } from "../../components/molecules/StateMessage";
import type { LoginInput, RegisterInput } from "../../types";
import { getErrorMessage } from "../../utils/apiError";
import { homeVisuals } from "../../utils/menuVisuals";
import { loginSchema, registerSchema } from "./authSchema";
import { useLoginUser, useRegisterUser } from "./hooks";
import { getRegistrationNotice, getSafeRedirectTarget } from "./redirects";
import { useAuth } from "./useAuth";

type AuthMode = "login" | "register";

const highlights = [
  "Protected routes keep checkout, orders, and admin access in sync with the JWT session.",
  "Session restore preserves the signed-in experience while leaving backend contracts untouched.",
  "The visual redesign upgrades the shell without altering authentication business logic.",
];

export function AuthPage() {
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [showRegisterPassword, setShowRegisterPassword] = useState(false);
  const [mode, setMode] = useState<AuthMode>("login");
  const auth = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const login = useLoginUser();
  const register = useRegisterUser();
  const modeFromRoute = location.pathname === "/register" ? "register" : "login";
  const registrationNotice = getRegistrationNotice(location.state);

  const loginForm = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });
  const registerForm = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: { email: "", name: "", password: "", surname: "" },
  });

  useEffect(() => {
    setMode(modeFromRoute);
  }, [modeFromRoute]);

  useEffect(() => {
    if (registrationNotice.email) {
      loginForm.setValue("email", registrationNotice.email);
    }
  }, [loginForm, registrationNotice.email]);

  function handleLogin(values: LoginInput) {
    login.mutate(values, {
      onSuccess: (data) => {
        auth.acceptLogin(data);
        navigate(getSafeRedirectTarget(location.state, "/account"), { replace: true });
      },
    });
  }

  function handleRegister(values: RegisterInput) {
    register.mutate(values, {
      onSuccess: () => {
        navigate("/login", {
          replace: true,
          state: {
            ...(typeof location.state === "object" && location.state ? location.state : {}),
            registrationEmail: values.email,
            registrationSuccess: "Account created. Sign in to continue.",
          },
        });
      },
    });
  }

  function handleModeChange(nextMode: AuthMode) {
    navigate(nextMode === "login" ? "/login" : "/register", {
      replace: location.pathname === (nextMode === "login" ? "/login" : "/register"),
      state: location.state,
    });
  }

  if (auth.isAuthenticated) {
    return <Navigate replace to={getSafeRedirectTarget(location.state, "/account")} />;
  }

  return (
    <PageShell className="max-w-none px-5 pb-20 sm:px-7 lg:px-10">
      <div className="mx-auto grid max-w-[92rem] gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
        <section className="space-y-6">
          <div>
            <p className="eyebrow">Welcome</p>
            <h1 className="display-title mt-4 text-[3.5rem] text-ink sm:text-[4.7rem]">
              Sign in for a seamless order flow.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-ink-muted">
              Authentication, protected routes, profile access, and checkout gating
              all stay intact. This screen now simply presents them with a more
              refined front door.
            </p>
          </div>

          <ProductImageFallback
            aspectClassName="aspect-[4/5] min-h-[22rem]"
            imageUrl={homeVisuals.hero}
            loading="eager"
            name="QuickBite table spread"
            overlayLabel="Protected experience"
          />

          <div className="grid gap-3">
            {highlights.map((highlight) => (
              <div
                key={highlight}
                className="rounded-[1.5rem] border border-line/80 bg-cream-soft/80 px-4 py-4 shadow-xs"
              >
                <p className="text-sm leading-7 text-ink-muted">{highlight}</p>
              </div>
            ))}
          </div>
        </section>

        <motion.section
          className="glass-surface rounded-[2.2rem] p-5 sm:p-6"
          initial={{ opacity: 0, y: 18, scale: 0.985 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
        >
          <div className="grid grid-cols-2 rounded-full border border-line/80 bg-cream p-1">
            {(["login", "register"] as const).map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => handleModeChange(item)}
                className={`min-h-touch rounded-full text-sm font-semibold capitalize transition-all ${
                  mode === item ? "bg-ink text-cream-soft shadow-soft" : "text-ink-muted"
                }`}
              >
                {item}
              </button>
            ))}
          </div>

          {mode === "login" ? (
            <form className="mt-6 space-y-5" onSubmit={loginForm.handleSubmit(handleLogin)}>
              {registrationNotice.message ? (
                <StateMessage tone="success">{registrationNotice.message}</StateMessage>
              ) : null}
              <label className="block">
                <span className="text-sm font-semibold uppercase tracking-[0.16em] text-ink-soft">
                  Email
                </span>
                <input
                  {...loginForm.register("email")}
                  aria-invalid={Boolean(loginForm.formState.errors.email)}
                  autoComplete="email"
                  className="field mt-3"
                  type="email"
                />
                {loginForm.formState.errors.email ? <span role="alert" className="mt-2 block text-sm text-clay-dark">{loginForm.formState.errors.email.message}</span> : null}
              </label>
              <label className="block">
                <span className="text-sm font-semibold uppercase tracking-[0.16em] text-ink-soft">
                  Password
                </span>
                <span className="relative mt-3 block">
                  <input
                    {...loginForm.register("password")}
                    aria-invalid={Boolean(loginForm.formState.errors.password)}
                    autoComplete="current-password"
                    className="field pr-12"
                    type={showLoginPassword ? "text" : "password"}
                  />
                  <button aria-label={showLoginPassword ? "Hide password" : "Show password"} className="absolute inset-y-0 right-0 px-4" type="button" onClick={() => setShowLoginPassword((value) => !value)}>{showLoginPassword ? <EyeOff aria-hidden className="size-5" /> : <Eye aria-hidden className="size-5" />}</button>
                </span>
                {loginForm.formState.errors.password ? <span role="alert" className="mt-2 block text-sm text-clay-dark">{loginForm.formState.errors.password.message}</span> : null}
              </label>
              {login.isError ? (
                <StateMessage tone="error">{getErrorMessage(login.error)}</StateMessage>
              ) : null}
              <Button disabled={login.isPending} className="w-full">
                {login.isPending ? "Signing in" : "Sign in"}
              </Button>
            </form>
          ) : (
            <form
              className="mt-6 space-y-5"
              onSubmit={registerForm.handleSubmit(handleRegister)}
            >
              <div className="grid gap-5 sm:grid-cols-2">
                <label className="block">
                  <span className="text-sm font-semibold uppercase tracking-[0.16em] text-ink-soft">
                    Name
                  </span>
                  <input
                    {...registerForm.register("name")}
                    autoComplete="given-name"
                    className="field mt-3"
                  />
                </label>
                <label className="block">
                  <span className="text-sm font-semibold uppercase tracking-[0.16em] text-ink-soft">
                    Surname
                  </span>
                  <input
                    {...registerForm.register("surname")}
                    autoComplete="family-name"
                    className="field mt-3"
                  />
                </label>
              </div>
              <label className="block">
                <span className="text-sm font-semibold uppercase tracking-[0.16em] text-ink-soft">
                  Email
                </span>
                <input
                  {...registerForm.register("email")}
                  autoComplete="email"
                  className="field mt-3"
                  type="email"
                />
              </label>
              <label className="block">
                <span className="text-sm font-semibold uppercase tracking-[0.16em] text-ink-soft">
                  Password
                </span>
                <span className="relative mt-3 block">
                  <input
                    {...registerForm.register("password")}
                    autoComplete="new-password"
                    className="field pr-12"
                    maxLength={15}
                    minLength={8}
                    type={showRegisterPassword ? "text" : "password"}
                  />
                  <button aria-label={showRegisterPassword ? "Hide password" : "Show password"} className="absolute inset-y-0 right-0 px-4" type="button" onClick={() => setShowRegisterPassword((value) => !value)}>{showRegisterPassword ? <EyeOff aria-hidden className="size-5" /> : <Eye aria-hidden className="size-5" />}</button>
                </span>
              </label>
              {register.isError ? (
                <StateMessage tone="error">{getErrorMessage(register.error)}</StateMessage>
              ) : null}
              <Button disabled={register.isPending} className="w-full">
                {register.isPending ? "Creating account" : "Create account"}
              </Button>
            </form>
          )}

          <p className="mt-6 text-center text-sm leading-7 text-ink-muted">
            Protected destinations still send you back after sign-in, and account
            details remain read-only because the current backend exposes identity
            data rather than profile editing.
          </p>
        </motion.section>
      </div>
    </PageShell>
  );
}
