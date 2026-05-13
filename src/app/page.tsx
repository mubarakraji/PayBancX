'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import styles from './page.module.css';
import { MdPlayArrow, MdCheckCircle } from 'react-icons/md';
import { useAuth } from '@/hooks/useAuth';

export default function Home() {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      router.replace('/home');
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F5F6F8] flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin">
            <div className="w-12 h-12 border-4 border-[#2D5D59]/20 border-t-[#2D5D59] rounded-full" />
          </div>
          <p className="text-[#888888] mt-4">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`${styles.bgGrid} min-h-screen bg-[#F5F6F8] text-[#333333] font-sans overflow-x-hidden`}>

      {/* Glow Blob */}
      <div className={styles.glowBlob} />

      {/* NAV */}
      <nav className="z-10 flex items-center justify-between px-3 xs:px-4 sm:px-5 md:px-6 lg:px-8 py-5 sm:py-6 border-b border-[rgba(45,93,89,0.1)] bg-white/40 backdrop-blur-sm sticky top-0">
        <div className="font-[family-name:Syne] text-2xl sm:text-3xl font-extrabold text-[#2D5D59] tracking-tight">
          PayBancX
        </div>
        <Link href="/login">
          <button className="bg-[#2D5D59] text-white px-4 sm:px-6 py-2.5 rounded-lg font-semibold text-sm sm:text-base transition-all hover:bg-[#1F4440] hover:shadow-lg hover:-translate-y-0.5 active:scale-95">
            Sign In
          </button>
        </Link>
      </nav>

      {/* HERO */}
      <section className="relative z-5 flex flex-col md:grid md:grid-cols-2 gap-5 md:gap-8 lg:gap-10 max-w-6xl mx-auto px-3 xs:px-4 sm:px-5 md:px-6 lg:px-8 py-6 sm:py-7 md:py-8">

        {/* LEFT COPY */}
        <div className="flex flex-col gap-4 md:gap-5 justify-start">

          {/* Badge */}
          <div className={`${styles.fadeUpItem} inline-flex items-center gap-2 bg-[rgba(45,93,89,0.12)] border border-[rgba(45,93,89,0.2)] text-[#2D5D59] text-xs font-medium px-3 py-1.5 sm:px-4 sm:py-2 rounded-full w-fit tracking-widest uppercase`}>
            <span className={`${styles.badgeDot} w-1.5 h-1.5 rounded-full bg-[#2D5D59]`} />
            Bill Payment Platform
          </div>

          {/* Title */}
          <h1 className={`${styles.fadeUpItem} font-[family-name:Syne] text-3xl sm:text-4xl md:text-4xl lg:text-5xl font-extrabold leading-tight tracking-tight text-[#333333]`}>
            The smartest<br />
            way to pay<br />
            <span className="text-[#2D5D59]">your bills.</span>
          </h1>

          {/* Subtitle */}
          <p className={`${styles.fadeUpItem} text-base sm:text-lg text-[#888888] leading-relaxed max-w-sm`}>
            Stay on top of your bills with a seamless payment experience right at your fingertips. Fast, secure, and effortless.
          </p>

          {/* Actions */}
          <div className={`${styles.fadeUpItem} flex flex-col sm:flex-row gap-3 sm:gap-4 items-start sm:items-center flex-wrap`}>
            <Link href="/signup" className="w-full sm:w-auto">
              <button className="w-full sm:w-auto bg-[#2D5D59] text-white px-6 sm:px-8 py-2.5 sm:py-3 rounded-full font-semibold text-base sm:text-lg transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-[rgba(45,93,89,0.25)] tracking-tight">
                Get Started
              </button>
            </Link>
            <button className="w-full sm:w-auto bg-transparent text-[#333333] border border-[rgba(45,93,89,0.2)] px-6 sm:px-8 py-2.5 sm:py-3 rounded-full font-normal text-base sm:text-lg transition-all flex items-center justify-center sm:justify-start gap-2 hover:border-[rgba(45,93,89,0.4)] hover:bg-[rgba(45,93,89,0.04)]">
              <MdPlayArrow size={14} />
              Watch Demo
            </button>
          </div>

          {/* Trust Signals */}
          <div className={`${styles.fadeUpItem} text-xs sm:text-sm text-[#888888] flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3`}>
            <span className="flex items-center gap-2">
              <MdCheckCircle size={14} color="#2D5D59" />
              No hidden fees
            </span>
            <span className="hidden sm:inline">·</span>
            <span className="flex items-center gap-2">
              <MdCheckCircle size={14} color="#2D5D59" />
              Instant payments
            </span>
            <span className="hidden sm:inline">·</span>
            <span className="flex items-center gap-2">
              <MdCheckCircle size={14} color="#2D5D59" />
              256-bit encryption
            </span>
          </div>

          {/* Stats */}
          <div className={`${styles.fadeUpItem} flex flex-col sm:flex-row gap-6 sm:gap-10 pt-4 sm:pt-6 border-t border-[rgba(45,93,89,0.1)]`}>
            <div className="flex flex-col gap-0.5">
              <span className="font-[family-name:Syne] text-2xl sm:text-3xl font-bold text-[#333333]">50K+</span>
              <span className="text-xs text-[#888888]">Active users</span>
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="font-[family-name:Syne] text-2xl sm:text-3xl font-bold text-[#333333]">₦2B+</span>
              <span className="text-xs text-[#888888]">Bills paid</span>
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="font-[family-name:Syne] text-2xl sm:text-3xl font-bold text-[#333333]">99.9%</span>
              <span className="text-xs text-[#888888]">Uptime</span>
            </div>
          </div>
        </div>

        {/* RIGHT VISUAL */}
        <div className={`${styles.fadeUpItem} flex justify-center items-start w-ful`}>
          <Image
            src="/a1.png"
            alt="PayBancX App Dashboard Preview"
            width={520}
            height={900}
            priority
            className="w-full h-auto object-contain  rounded-lg"
          />
        </div>

      </section>

      {/* TICKER BAR */}
      <div className="relative z-5 border-t border-[rgba(45,93,89,0.08)] overflow-hidden py-2 sm:py-3 bg-[rgba(45,93,89,0.02)]">
        <div className={styles.tickerTrack}>
          {[
            'Pay electricity bills',
            'Buy airtime & data',
            'Pay cable TV',
            'Games & Bets ',
          ].flatMap((label, i, arr) =>
            // duplicate for seamless loop
            [label, ...arr].map((text, j) => (
              <span
                key={`${i}-${j}`}
                className="text-xs sm:text-sm text-[#888888] flex items-center gap-2 tracking-widest uppercase"
              >
                <span className="text-[#2D5D59]">✦</span> {text}
              </span>
            ))
          ).slice(0, 14)}
        </div>
      </div>

    </div>
  );
}