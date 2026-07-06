import { motion } from "framer-motion";
import { X } from "lucide-react";

interface LoginModalProps {
  open: boolean;
  onClose: () => void;
  onSignIn: () => void;
}

export function LoginModal({ open, onClose, onSignIn }: LoginModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-forest-dark/40 backdrop-blur-md"
        onClick={onClose}
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.92, y: 20 }}
        transition={{ type: "spring", stiffness: 320, damping: 28 }}
        className="relative w-full max-w-4xl overflow-hidden rounded-3xl bg-white/90 shadow-lift backdrop-blur-xl"
      >
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute right-4 top-4 z-10 grid h-9 w-9 place-items-center rounded-full bg-white/80 text-forest shadow-soft hover:bg-white"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="grid md:grid-cols-2">
          <div className="relative hidden min-h-[480px] md:block">
            <img
              src="/images/hero-beach.png"
              alt=""
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-forest-dark/60 to-transparent" />
            <div className="absolute bottom-8 left-8 right-8 text-white">
              <p className="font-display text-3xl italic leading-tight">
                Let's continue
                <br />
                your story.
              </p>
            </div>
          </div>

          <div className="flex flex-col justify-center px-8 py-10 sm:px-10">
            <p className="font-display text-2xl text-forest">Welcome back</p>
            <p className="mt-1 text-sm text-ink-muted">Sign in to your studio workspace</p>

            <form
              className="mt-8 space-y-4"
              onSubmit={(e) => {
                e.preventDefault();
                onSignIn();
              }}
            >
              <div>
                <label className="text-xs font-medium uppercase tracking-wider text-ink-faint">
                  Email
                </label>
                <input
                  type="email"
                  defaultValue="matt@lensandlove.com"
                  className="input mt-1.5 border-line-soft"
                />
              </div>
              <div>
                <div className="flex items-center justify-between">
                  <label className="text-xs font-medium uppercase tracking-wider text-ink-faint">
                    Password
                  </label>
                  <button type="button" className="text-xs text-blush-600 hover:underline">
                    Forgot password?
                  </button>
                </div>
                <input type="password" defaultValue="••••••••" className="input mt-1.5 border-line-soft" />
              </div>
              <label className="flex items-center gap-2 text-sm text-ink-muted">
                <input type="checkbox" defaultChecked className="rounded border-line" />
                Remember me
              </label>
              <button
                type="submit"
                className="w-full rounded-full bg-forest py-3 text-sm font-semibold text-white shadow-soft transition hover:bg-forest-light"
              >
                Sign In
              </button>
            </form>

            <div className="my-6 flex items-center gap-3">
              <div className="h-px flex-1 bg-line" />
              <span className="text-xs text-ink-faint">or continue with</span>
              <div className="h-px flex-1 bg-line" />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button className="rounded-full border border-line py-2.5 text-sm font-medium text-ink-soft hover:bg-blush-50">
                Google
              </button>
              <button className="rounded-full border border-line py-2.5 text-sm font-medium text-ink-soft hover:bg-blush-50">
                Apple
              </button>
            </div>

            <p className="mt-6 text-center text-sm text-ink-muted">
              New here?{" "}
              <button type="button" className="font-medium text-blush-600 hover:underline">
                Create account
              </button>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
