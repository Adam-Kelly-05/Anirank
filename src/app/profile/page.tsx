"use client"

import React from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useUserObject } from '@/components/user'
import FetchReviewsObject from '@/components/reviews'

export default function ProfilePage() {
  const fetchedUser = useUserObject(1);

  return (
    <main className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Profile Header */}
        <Card className="mb-8 bg-gradient-to-r from-blue-600/20 to-purple-600/20 border-primary/30">
          <CardContent className="p-8">
            <div className="flex flex-col items-center gap-6">
              {/* Avatar */}
              {fetchedUser?.ProfilePicture ? (
                <div className="flex-shrink-0">
                  <img
                    src={fetchedUser.ProfilePicture}
                    alt={`${fetchedUser.Username}'s avatar`}
                    className="w-32 h-32 rounded-full object-cover shadow-2xl"
                  />
                </div>
              ) : (
                <div className="flex-shrink-0">
                  <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-5xl font-bold shadow-2xl">
                    {/* First letter as default Avatar */}
                    {fetchedUser?.Username?.charAt(0).toUpperCase()}
                  </div>
                </div>
              )}

              {/* User Info */}
              <div className="flex-1 text-center">
                <h1 className="text-4xl font-bold text-white mb-2">
                  {fetchedUser?.Username}
                </h1>
                <p className="text-gray-400 text-lg mb-4">
                  {fetchedUser?.Bio}
                </p>
                <div className="flex flex-wrap justify-center gap-4 text-sm">
                  <div className="px-4 py-2 bg-card rounded-lg border border-primary/20">
                    <p className="text-gray-400">User Since: <span className="ml-2 text-white font-semibold">{fetchedUser?.DateJoin}</span></p>
                  </div>
                </div>
                
                {/*Logout Button*/}
                <div className="mt-6">
                  <Button
                    variant="outline"
                    className="border-red-500/50 text-red-400 hover:bg-red-500/10 hover:text-red-300 hover:border-red-500"
                    onClick={() => console.log("Logout clicked")}
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    Logout
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats Section */} {/* Used 1 as a temperaty value here, lambda's have not been made yet */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-card border-primary/20">
            <CardContent className="p-6 text-center">
              <div className="text-4xl font-bold text-blue-400 mb-2">{1}</div>
              <div className="text-gray-400">Total Reviews</div>
            </CardContent>
          </Card>
          <Card className="bg-card border-primary/20">
            <CardContent className="p-6 text-center">
              <div className="text-4xl font-bold text-purple-400 mb-2">{1}</div>
              <div className="text-gray-400">Average Score</div>
            </CardContent>
          </Card>
          <Card className="bg-card border-primary/20">
            <CardContent className="p-6 text-center">
              <div className="text-4xl font-bold text-green-400 mb-2">{1}</div>
              <div className="text-gray-400">Anime Reviewed</div>
            </CardContent>
          </Card>
        </div>

        {/* Reviews Section */}
        <div>
          <h2 className="text-3xl font-bold text-white mb-6">My Reviews</h2>

          <FetchReviewsObject id={fetchedUser?.userId} idType="user" />
        </div>
          
      </div>
    </main>
  )
}
