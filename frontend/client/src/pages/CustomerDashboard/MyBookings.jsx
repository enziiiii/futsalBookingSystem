"use client";

import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { fetchBookings } from '../../reducers/bookSlice';
import moment from 'moment';
import { CalendarDaysIcon, ClockIcon, XCircleIcon, CheckCircleIcon } from '@heroicons/react/24/solid';
import { CalendarDays, Clock, XCircle, CheckCircle } from 'lucide-react'
import { motion } from "framer-motion";
import { format } from "date-fns";
import clsx from 'clsx';

const MyBookings = () => {
    const dispatch = useDispatch();
    const user = useSelector((state) => state.auth.user);
    const bookings = useSelector((state) => state.booking.bookings.customerBookings|| []);
    const loading = useSelector((state) => state.booking.status.customer);
  
    useEffect(() => {
      if (user?.userId) {
        dispatch(fetchBookings(user.userId));
      }
    }, [dispatch, user]);
  
    const statusBadge = (status) => {
      const base = "px-2 py-1 text-xs font-semibold rounded-full";
      switch (status) {
        case "confirmed":
          return clsx(base, "bg-green-100 text-green-700");
        case "canceled":
          return clsx(base, "bg-red-100 text-red-700");
        default:
          return clsx(base, "bg-gray-100 text-gray-700");
      }
    };
  
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-slate-900 mb-6">
          My Bookings
        </h2>
  
        {loading === "pending" ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-28 bg-gray-200 dark:bg-zinc-800 animate-pulse rounded-xl" />
            ))}
          </div>
        ) : bookings.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {bookings.map((booking, index) => (
              <motion.div
                key={booking.booking_id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-2xl shadow-sm hover:shadow-lg transition duration-300 p-5"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-indigo-600 dark:text-indigo-400">
                    Booking #{booking.booking_id}
                  </h3>
                  <span className={statusBadge(booking.status)}>
                    {booking.status === "canceled" ? "Canceled" : "Confirmed"}
                  </span>
                </div>
  
                <div className="flex items-center text-sm text-gray-700 dark:text-gray-300 gap-2 mb-2">
                  <CalendarDays className="w-4 h-4 text-indigo-500" />
                  <span>{format(new Date(booking.start_time), "EEEE, MMM d, yyyy")}</span>
                </div>
  
                <div className="flex items-center text-sm text-gray-700 dark:text-gray-300 gap-2 mb-2">
                  <Clock className="w-4 h-4 text-indigo-500" />
                  <span>{format(new Date(booking.start_time), "hh:mm a")}</span>
                </div>
  
                {booking.status === "canceled" ? (
                  <div className="mt-3 text-red-600 dark:text-red-400 text-sm flex items-center">
                    <XCircle className="w-4 h-4 mr-1" />
                    {booking.cancellation_reason || "No reason provided."}
                  </div>
                ) : (
                  <div className="mt-3 text-green-600 dark:text-green-400 text-sm flex items-center">
                    <CheckCircle className="w-4 h-4 mr-1" />
                    Booking confirmed and paid
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center text-gray-500 dark:text-zinc-400 mt-24">
            <p className="text-lg font-semibold">No bookings yet</p>
            <p className="text-sm">Start by booking a court to see it here 🏟️</p>
          </div>
        )}
      </div>
    );
  };
  
  export default MyBookings;
