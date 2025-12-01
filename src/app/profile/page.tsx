"use client"

import React from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import users from '@/extras/users.json'
import reviews from '@/extras/reviews.json'
import anime from '@/extras/anime.json'

interface User {
  userId: number
  username: string
  createdAt: string
  bio: string
}

interface Review {
  reviewId: number
  userId: number
  animeId: number
  score: number
  reviewText: string
  ratedAt: string
}

interface AnimeItem {
  animeId: number
  englishTitle: string
  cover: string
}

export default function ProfilePage() {
    //Sample current user
    const currentUserId = 1
  const currentUser = users.find(u => u.userId === currentUserId) as User
  const userReviews = reviews.filter(r => r.userId === currentUserId) as Review[]
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    })
  }

  const getAnimeTitle = (animeId: number) => {
    const animeItem = anime.find(a => a.animeId === animeId) as AnimeItem | undefined
    return animeItem?.englishTitle || 'Unknown Anime'
  }

  const getAnimeCover = (animeId: number) => {
    const animeItem = anime.find(a => a.animeId === animeId) as AnimeItem | undefined
    return animeItem?.cover || ''
  }

  const averageScore = userReviews.length > 0 
    ? (userReviews.reduce((sum, r) => sum + r.score, 0) / userReviews.length).toFixed(1)
    : 'N/A'

  return (
    <main className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Profile Header */}
        <Card className="mb-8 bg-gradient-to-r from-blue-600/20 to-purple-600/20 border-primary/30">
          <CardContent className="p-8">
            <div className="flex flex-col items-center gap-6">
              {/* Avatar */}
              <div className="flex-shrink-0">
                <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-5xl font-bold shadow-2xl">
                  {/* First letter as default Avatar */}
                  {currentUser.username.charAt(0).toUpperCase()}
                </div>
              </div>

              {/* User Info */}
              <div className="flex-1 text-center">
                <h1 className="text-4xl font-bold text-white mb-2">
                  {currentUser.username}
                </h1>
                <p className="text-gray-400 text-lg italic mb-4">
                  &ldquo;{currentUser.bio}&rdquo;
                </p>
                <div className="flex flex-wrap justify-center gap-4 text-sm">
                  <div className="px-4 py-2 bg-card rounded-lg border border-primary/20">
                    <span className="text-gray-400">Member since:</span>
                    <span className="ml-2 text-white font-semibold">{formatDate(currentUser.createdAt)}</span>
                  </div>
                </div>
                
                {/*Logout Button*/}
                <div className="mt-6">
                  <Button 
                    variant="outline" 
                    className="border-red-500/50 text-red-400 hover:bg-red-500/10 hover:text-red-300 hover:border-red-500"
                    onClick={() => {
                      //Logout functionality implemented later
                      console.log('Logout clicked')
                    }}
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

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-card border-primary/20">
            <CardContent className="p-6 text-center">
              <div className="text-4xl font-bold text-blue-400 mb-2">{userReviews.length}</div>
              <div className="text-gray-400">Total Reviews</div>
            </CardContent>
          </Card>
          <Card className="bg-card border-primary/20">
            <CardContent className="p-6 text-center">
              <div className="text-4xl font-bold text-purple-400 mb-2">{averageScore}</div>
              <div className="text-gray-400">Average Score</div>
            </CardContent>
          </Card>
          <Card className="bg-card border-primary/20">
            <CardContent className="p-6 text-center">
              <div className="text-4xl font-bold text-green-400 mb-2">{userReviews.length}</div>
              <div className="text-gray-400">Anime Reviewed</div>
            </CardContent>
          </Card>
        </div>

        {/* Reviews Section */}
        <div>
          <h2 className="text-3xl font-bold text-white mb-6">My Reviews</h2>
          
          {userReviews.length === 0 ? (
            <Card className="bg-card border-primary/20">
              <CardContent className="p-12 text-center">
                <p className="text-gray-400 text-lg">You haven&apos;t written any reviews yet.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {userReviews.map((review) => (
                <Card key={review.reviewId} className="bg-card border-primary/20 hover:border-primary/40 transition-all">
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row gap-4">
                      {/* Anime Cover */}
                      <div className="flex-shrink-0">
                        <img
                          src={getAnimeCover(review.animeId)}
                          alt={getAnimeTitle(review.animeId)}
                          className="w-24 h-32 object-cover rounded"
                        />
                      </div>

                      {/* Review Content */}
                      <div className="flex-1">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h3 className="text-xl font-bold text-white mb-1">
                              {getAnimeTitle(review.animeId)}
                            </h3>
                            <p className="text-gray-500 text-sm">
                              Reviewed on {formatDate(review.ratedAt)}
                            </p>
                          </div>
                          <div className="flex items-center gap-1 px-3 py-1 bg-primary/20 text-primary rounded-full font-bold">
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                            {review.score}/10
                          </div>
                        </div>
                        <p className="text-gray-300">
                          {review.reviewText}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
