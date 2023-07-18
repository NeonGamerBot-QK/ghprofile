export default function NoElectron() {
return (
    <div className="hero min-h-screen bg-red-950 md:bg-amber-950">
  <div className="hero-content text-center">
    <div className="max-w-xl">
      <h1 className="text-5xl font-bold">No Electron</h1>
      <p className="py-6">The window is found not using an electron process</p>
     <p>This is prob because its open in an web app with no inject electron variables </p>
    </div>
  </div>
</div>
)
}