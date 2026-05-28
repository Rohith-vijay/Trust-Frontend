import React from "react";

/**
 * Single skeletal card mimicking SuccessStoryCard / EventCard structure
 */
export const CardSkeleton = React.memo(() => {
  return (
    <div className="bg-white rounded-[20px] border border-gray-100/80 shadow-sm overflow-hidden flex flex-col h-[400px]">
      {/* Media placeholder */}
      <div className="shimmer-bg w-full h-[200px]" />
      
      {/* Body content */}
      <div className="p-5 flex-grow flex flex-col">
        {/* Chip row */}
        <div className="flex gap-2 mb-3">
          <div className="shimmer-bg-gold h-5 w-16 rounded-full" />
          <div className="shimmer-bg h-5 w-20 rounded-full" />
        </div>
        
        {/* Title */}
        <div className="shimmer-bg h-6 w-3/4 rounded mb-4" />
        
        {/* Description lines */}
        <div className="shimmer-bg h-3.5 w-full rounded mb-2.5" />
        <div className="shimmer-bg h-3.5 w-5/6 rounded mb-2.5" />
        <div className="shimmer-bg h-3.5 w-2/3 rounded mb-5" />
        
        {/* Testimonial block quote simulation */}
        <div className="mt-auto pt-4 border-t border-gray-100 flex items-center justify-between">
          <div className="shimmer-bg h-4 w-28 rounded" />
          <div className="shimmer-bg h-4 w-4 rounded-full" />
        </div>
      </div>
    </div>
  );
});

/**
 * CardGridSkeleton component: A responsive grid of skeleton cards
 */
export const CardGridSkeleton = React.memo(({ count = 3, columnsClass = "grid md:grid-cols-3 gap-8" }) => {
  return (
    <div className={`${columnsClass} px-8 max-w-7xl mx-auto w-full`}>
      {Array.from({ length: count }).map((_, i) => (
        <CardSkeleton key={i} />
      ))}
    </div>
  );
});

/**
 * DetailSkeleton component: Mimics full SuccessStory / Event detail loading
 */
export const DetailSkeleton = React.memo(() => {
  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      {/* Title */}
      <div className="shimmer-bg h-10 w-2/3 rounded-xl mb-4" />
      
      {/* Category/location tags */}
      <div className="flex gap-3 mb-8">
        <div className="shimmer-bg-gold h-6 w-24 rounded-full" />
        <div className="shimmer-bg h-6 w-32 rounded-full" />
      </div>
      
      {/* Hero media block */}
      <div className="shimmer-bg w-full h-[400px] rounded-3xl mb-8" />
      
      {/* Text block */}
      <div className="space-y-4 mb-8">
        <div className="shimmer-bg h-4 w-full rounded" />
        <div className="shimmer-bg h-4 w-full rounded" />
        <div className="shimmer-bg h-4 w-11/12 rounded" />
        <div className="shimmer-bg h-4 w-5/6 rounded" />
      </div>
      
      {/* Image Gallery Grid placeholder */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <div className="shimmer-bg h-[200px] rounded-2xl" />
        <div className="shimmer-bg h-[150px] rounded-2xl" />
        <div className="shimmer-bg h-[180px] rounded-2xl" />
      </div>
    </div>
  );
});

/**
 * UserDashboardOverviewSkeleton component: Mirrors the Donor/User Dashboard layout
 */
export const UserDashboardOverviewSkeleton = React.memo(() => {
  return (
    <div className="space-y-8 animate-pulse w-full">
      {/* Greeting and Tier row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Large glassmorphic greeting card */}
        <div className="lg:col-span-2 rounded-3xl bg-slate-905 p-8 h-64 flex flex-col justify-between shadow-lg" style={{ backgroundColor: "#0F172A" }}>
          <div className="space-y-3">
            <div className="shimmer-bg h-4 w-24 rounded-full opacity-20" />
            <div className="shimmer-bg h-8 w-2/3 rounded-lg opacity-20" />
            <div className="shimmer-bg h-4 w-1/2 rounded opacity-10" />
          </div>
          <div className="flex justify-between items-center mt-6 border-t border-slate-800 pt-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full shimmer-bg opacity-20" />
              <div className="space-y-1.5">
                <div className="shimmer-bg h-3 w-20 rounded opacity-20" />
                <div className="shimmer-bg h-2 w-16 rounded opacity-10" />
              </div>
            </div>
            <div className="flex gap-2">
              <div className="w-24 h-8 rounded-xl shimmer-bg opacity-30" />
              <div className="w-24 h-8 rounded-xl shimmer-bg opacity-10" />
            </div>
          </div>
        </div>

        {/* Recognition Tier Card */}
        <div className="rounded-3xl border border-slate-200 bg-white p-6 h-64 flex flex-col justify-between shadow-sm">
          <div className="space-y-2">
            <div className="shimmer-bg h-3.5 w-32 rounded" />
            <div className="shimmer-bg h-6 w-3/4 rounded-lg" />
            <div className="shimmer-bg h-3.5 w-5/6 rounded" />
          </div>
          <div className="space-y-2 mt-4">
            <div className="flex justify-between">
              <div className="shimmer-bg h-3 w-24 rounded" />
              <div className="shimmer-bg h-3 w-8 rounded" />
            </div>
            <div className="w-full h-2.5 bg-slate-100 rounded-full" />
            <div className="flex justify-between">
              <div className="shimmer-bg h-2 w-12 rounded" />
              <div className="shimmer-bg h-2 w-28 rounded" />
            </div>
          </div>
          <div className="border-t border-slate-100 pt-4 flex justify-between">
            <div className="shimmer-bg h-3 w-16 rounded" />
            <div className="shimmer-bg h-4 w-32 rounded" />
          </div>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="bg-white rounded-2xl border border-slate-100 p-5 space-y-3 shadow-sm">
            <div className="flex justify-between">
              <div className="shimmer-bg h-3.5 w-16 rounded" />
              <div className="shimmer-bg h-5 w-5 rounded-full" />
            </div>
            <div className="shimmer-bg h-7 w-20 rounded-md" />
            <div className="shimmer-bg h-3 w-24 rounded" />
          </div>
        ))}
      </div>

      {/* AI Assessment Banner */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 space-y-3 shadow-sm">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full shimmer-bg-gold" />
          <div className="shimmer-bg h-4 w-48 rounded" />
        </div>
        <div className="space-y-2">
          <div className="shimmer-bg h-3.5 w-full rounded" />
          <div className="shimmer-bg h-3.5 w-11/12 rounded" />
          <div className="shimmer-bg h-3.5 w-4/5 rounded" />
        </div>
      </div>

      {/* Analytics and Achievements */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Giving Trend Chart */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-100 p-6 h-80 flex flex-col justify-between shadow-sm">
          <div className="space-y-1.5">
            <div className="shimmer-bg h-5 w-48 rounded" />
            <div className="shimmer-bg h-3.5 w-64 rounded" />
          </div>
          <div className="h-40 flex items-end justify-between px-2 gap-4 pb-1">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-2">
                <div className="shimmer-bg w-full rounded-t-lg" style={{ height: `${20 + i * 12}px` }} />
                <div className="shimmer-bg h-3 w-8 rounded" />
              </div>
            ))}
          </div>
          <div className="border-t border-slate-100 pt-4 flex justify-between">
            <div className="shimmer-bg h-3.5 w-32 rounded" />
            <div className="shimmer-bg h-3.5 w-24 rounded" />
          </div>
        </div>

        {/* Achievements list */}
        <div className="bg-white rounded-3xl border border-slate-100 p-6 h-80 flex flex-col justify-between shadow-sm">
          <div className="space-y-1.5">
            <div className="shimmer-bg h-5 w-48 rounded" />
            <div className="shimmer-bg h-3.5 w-56 rounded" />
          </div>
          <div className="space-y-3 my-4 overflow-hidden">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3 p-2 bg-slate-50/50 rounded-xl">
                <div className="w-10 h-10 rounded-lg shimmer-bg" />
                <div className="space-y-1.5 flex-1">
                  <div className="shimmer-bg h-3 w-24 rounded" />
                  <div className="shimmer-bg h-2 w-32 rounded" />
                </div>
              </div>
            ))}
          </div>
          <div className="border-t border-slate-100 pt-3 text-center">
            <div className="shimmer-bg h-3.5 w-36 mx-auto rounded" />
          </div>
        </div>
      </div>
    </div>
  );
});

/**
 * VolunteerDashboardOverviewSkeleton component: Mirrors Volunteer Dashboard Overview
 */
export const VolunteerDashboardOverviewSkeleton = React.memo(() => {
  return (
    <div className="space-y-8 animate-pulse w-full">
      {/* Greeting and progress circle row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Large greeting card */}
        <div className="lg:col-span-2 rounded-3xl bg-emerald-950 p-8 h-64 flex flex-col justify-between shadow-lg" style={{ backgroundColor: "#064e3b" }}>
          <div className="space-y-3">
            <div className="shimmer-bg h-4 w-24 rounded-full opacity-20" />
            <div className="shimmer-bg h-8 w-2/3 rounded-lg opacity-20" />
            <div className="shimmer-bg h-4 w-1/2 rounded opacity-10" />
          </div>
          <div className="flex justify-between items-center mt-6 border-t border-emerald-900 pt-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full shimmer-bg opacity-20" />
              <div className="space-y-1.5">
                <div className="shimmer-bg h-3 w-20 rounded opacity-20" />
                <div className="shimmer-bg h-2 w-16 rounded opacity-10" />
              </div>
            </div>
            <div className="w-32 h-8 rounded-xl shimmer-bg opacity-30" />
          </div>
        </div>

        {/* Service Hour circular gauge card */}
        <div className="rounded-3xl bg-white border border-slate-150 p-6 h-64 flex flex-col justify-between shadow-sm">
          <div>
            <div className="shimmer-bg h-3.5 w-28 rounded" />
            <div className="shimmer-bg h-5 w-3/4 rounded mt-1.5" />
            <div className="shimmer-bg h-3.5 w-5/6 rounded mt-1" />
          </div>
          <div className="flex justify-center items-center gap-4 my-2">
            <div className="w-20 h-20 rounded-full border-[6px] border-slate-100 flex items-center justify-center">
              <div className="shimmer-bg h-4 w-8 rounded" />
            </div>
            <div className="space-y-2">
              <div className="shimmer-bg h-3.5 w-16 rounded" />
              <div className="shimmer-bg h-3.5 w-16 rounded" />
            </div>
          </div>
          <div className="border-t border-slate-100 pt-4">
            <div className="shimmer-bg h-3.5 w-32 rounded" />
          </div>
        </div>
      </div>

      {/* 4 Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="bg-white rounded-2xl border border-slate-100 p-6 space-y-3 shadow-sm">
            <div className="flex justify-between">
              <div className="shimmer-bg h-3.5 w-24 rounded" />
              <div className="shimmer-bg h-5 w-5 rounded-full" />
            </div>
            <div className="shimmer-bg h-7 w-12 rounded-md" />
            <div className="shimmer-bg h-3 w-28 rounded" />
          </div>
        ))}
      </div>

      {/* Action logs and achievements row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Timeline Log */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-100 p-6 h-80 flex flex-col justify-between shadow-sm">
          <div className="space-y-1.5">
            <div className="shimmer-bg h-5 w-48 rounded" />
            <div className="shimmer-bg h-3.5 w-64 rounded" />
          </div>
          <div className="space-y-4 my-4 flex-1">
            {Array.from({ length: 2 }).map((_, i) => (
              <div key={i} className="flex gap-4 items-start pl-2">
                <div className="w-2.5 h-2.5 rounded-full bg-slate-200 mt-1" />
                <div className="space-y-1.5 flex-1">
                  <div className="shimmer-bg h-3.5 w-28 rounded" />
                  <div className="shimmer-bg h-4 w-4/5 rounded" />
                  <div className="shimmer-bg h-3.5 w-11/12 rounded" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Service Achievements */}
        <div className="bg-white rounded-3xl border border-slate-100 p-6 h-80 flex flex-col justify-between shadow-sm">
          <div className="space-y-1.5">
            <div className="shimmer-bg h-5 w-48 rounded" />
            <div className="shimmer-bg h-3.5 w-56 rounded" />
          </div>
          <div className="space-y-3 my-4 overflow-hidden">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3 p-2 bg-slate-50/50 rounded-xl">
                <div className="w-10 h-10 rounded-lg shimmer-bg" />
                <div className="space-y-1.5 flex-1">
                  <div className="shimmer-bg h-3 w-24 rounded" />
                  <div className="shimmer-bg h-2 w-32 rounded" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
});

/**
 * AdminDashboardOverviewSkeleton component: Mirrors Admin Dashboard overview state
 */
export const AdminDashboardOverviewSkeleton = React.memo(() => {
  return (
    <div className="space-y-8 animate-pulse w-full">
      {/* Header glass greeting */}
      <div className="rounded-3xl border border-indigo-100 bg-white p-8 h-40 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-slate-100 shimmer-bg" />
          <div className="space-y-2">
            <div className="shimmer-bg h-8 w-64 rounded-lg" />
            <div className="shimmer-bg h-4 w-48 rounded" />
          </div>
        </div>
        <div className="w-32 h-10 rounded-full shimmer-bg" />
      </div>

      {/* 4 Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="bg-white rounded-2xl border border-gray-100 p-6 space-y-2 shadow-sm">
            <div className="shimmer-bg h-3.5 w-24 rounded" />
            <div className="shimmer-bg h-7 w-20 rounded-md" />
            <div className="shimmer-bg h-4 w-28 rounded-full" />
          </div>
        ))}
      </div>

      {/* Content wrapper with sidebar tabs mock */}
      <div className="bg-white rounded-3xl border border-gray-150 flex flex-col md:flex-row h-96 shadow-sm overflow-hidden">
        {/* Navigation Sidebar Panel */}
        <div className="w-full md:w-64 bg-gray-50/50 border-r border-gray-150 p-4 space-y-2.5">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="shimmer-bg h-10 w-full rounded-xl" />
          ))}
        </div>

        {/* Main Content Area */}
        <div className="flex-1 p-8 space-y-4">
          <div className="shimmer-bg h-6 w-48 rounded-lg" />
          <div className="shimmer-bg h-4 w-full rounded" />
          <div className="shimmer-bg h-4 w-11/12 rounded" />
          <div className="shimmer-bg h-4 w-4/5 rounded" />
          <div className="w-full border-t border-slate-100 pt-6 mt-6 grid grid-cols-2 gap-4">
            <div className="shimmer-bg h-24 rounded-2xl" />
            <div className="shimmer-bg h-24 rounded-2xl" />
          </div>
        </div>
      </div>
    </div>
  );
});

