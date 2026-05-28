import Link from 'next/link'

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-8 text-center">
      <div className="max-w-2xl">
        <span className="text-6xl mb-6 block">🏆</span>
        <h1 className="text-5xl font-bold mb-3 text-white">
          World Cup 2026
        </h1>
        <p className="text-2xl text-emerald-400 font-semibold mb-4">
          Champion Predictor
        </p>
        <p className="text-slate-400 text-lg mb-10 max-w-lg mx-auto leading-relaxed">
          Predict the knockout from group stage to the final.
          Rank teams in each group, build your bracket, and crown your champion.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/predict"
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 px-8 rounded-xl text-lg transition-colors shadow-lg shadow-emerald-900/30"
          >
            Start Predicting
          </Link>
        </div>
        <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-6 text-left">
          <div className="bg-slate-800/60 rounded-xl p-5 border border-slate-700/50">
            <span className="text-3xl block mb-2">📊</span>
            <h3 className="text-white font-semibold mb-1">Group Stage</h3>
            <p className="text-slate-400 text-sm">Rank all 48 teams across 12 groups from 1st to 4th.</p>
          </div>
          <div className="bg-slate-800/60 rounded-xl p-5 border border-slate-700/50">
            <span className="text-3xl block mb-2">🔄</span>
            <h3 className="text-white font-semibold mb-1">Knockout Bracket</h3>
            <p className="text-slate-400 text-sm">Drag teams into Round of 32 matchups and pick winners round by round.</p>
          </div>
          <div className="bg-slate-800/60 rounded-xl p-5 border border-slate-700/50">
            <span className="text-3xl block mb-2">👑</span>
            <h3 className="text-white font-semibold mb-1">Crown a Champion</h3>
            <p className="text-slate-400 text-sm">Make your final prediction and see your champion lift the trophy.</p>
          </div>
        </div>
      </div>
    </main>
  )
}
