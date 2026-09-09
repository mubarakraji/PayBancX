'use client';

import Link from 'next/link';
import { MdArrowForward, MdBolt, MdLocalOffer } from 'react-icons/md';

export function ServicePromotionBanner() {
  return (
    <section aria-label="PayBancX offers" className="mb-5 grid gap-3 lg:grid-cols-[1.45fr_0.55fr]">
      <div className="relative overflow-hidden rounded-3xl bg-[#285858] px-5 py-6 text-white shadow-sm sm:px-7 sm:py-7">
        <div className="absolute -right-10 -top-14 h-40 w-40 rounded-full border-[18px] border-[#3F8F63]/30" aria-hidden="true" />
        <div className="absolute -bottom-20 right-20 h-44 w-44 rounded-full border-[22px] border-[#FFF4C8]/15" aria-hidden="true" />
        <div className="relative z-10 max-w-xl">
          <div className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#FFF4C8]">
            <MdBolt className="text-base" aria-hidden="true" />
            PayBancX offer
          </div>
          <h2 className="max-w-md font-[family-name:Syne] text-2xl font-bold leading-tight sm:text-3xl">
            Keep life moving with payments that work for you.
          </h2>
          <p className="mt-2 max-w-md text-sm leading-6 text-white/75 sm:text-base">
            Airtime, data, bills, and subscriptions in one simple place.
          </p>
          <Link
            href="/payment/airtime"
            className="mt-5 inline-flex items-center gap-2 rounded-full bg-[#FFF4C8] px-4 py-2.5 text-sm font-bold text-[#285858] transition hover:bg-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-[#285858]"
          >
            Start a payment
            <MdArrowForward aria-hidden="true" />
          </Link>
        </div>
      </div>

      <Link
        href="/payment"
        className="group flex min-h-48 flex-col justify-between rounded-3xl border border-[#FF6845]/25 bg-[#F8E0E0] p-5 text-[#171717] transition hover:border-[#FF6845]/50 hover:shadow-sm focus:outline-none focus:ring-2 focus:ring-[#FF6845]/40 sm:p-6"
      >
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-[#FF6845] shadow-sm">
          <MdLocalOffer className="text-2xl" aria-hidden="true" />
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#FF6845]">More to explore</p>
          <h3 className="mt-1 text-lg font-bold">All your services, ready.</h3>
          <span className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-[#285858]">
            View services
            <MdArrowForward className="transition-transform group-hover:translate-x-1" aria-hidden="true" />
          </span>
        </div>
      </Link>
    </section>
  );
}