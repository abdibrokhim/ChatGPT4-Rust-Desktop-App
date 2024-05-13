export default function Notes() {
    return (
      <div className="flex flex-col w-full py-2 pl-3 flex-grow md:py-3 md:pl-4 relative border border-black/10 bg-white dark:border-gray-900/50 dark:text-dark text-dark dark:bg-gray-700 rounded-md shadow-[0_0_10px_rgba(0,0,0,0.10)] dark:shadow-[0_0_15px_rgba(0,0,0,0.10)]">
        <div className="flex flex-col">
          <div className="text-white pl-2 mt-4">
            <div className="text-md text-red-500">Important!</div>
            <ul className="text-sm list-disc list-inside">
              <li>Nothing is saved</li>
              <li>Refresh to start new chat</li>
            </ul>
          </div>
          <div className="text-white pl-2 mt-4">
            <div className="text-md text-green-500">
              <a href="https://github.com/abdibrokhim/Custom-AI-Assistant" target="_blank" rel="noreferrer">Open Source</a>
            </div>
          </div>
          <div className="text-white pl-2 mt-4">
            <div className="text-md">Support me</div>
            <ul className="text-sm list-disc list-inside">
              <li>
                <a className="text-blue-400" href="https://buymeacoffee.com/abdibrokhim/" target="_blank" rel="noreferrer">BuyMeCoffe</a>
              </li>
              <li>
                <a className="text-blue-400" href="https://patreon.com/abdibrokhim/" target="_blank" rel="noreferrer">Patreon</a>
              </li>
            </ul>
          </div>
          <div className="text-white pl-2 mt-4">
            <div className="text-md">Let's connect!</div>
            <ul className="text-sm list-disc list-inside">
              <li>
                <a className="text-blue-400" href="https://linkedin.com/in/abdibrokhim/" target="_blank" rel="noreferrer">LinkedIn</a>
              </li>
              <li>
                <a className="text-blue-400" href="https://github.com/abdibrokhim/" target="_blank" rel="noreferrer">Github</a>
              </li>
              <li>
                <a className="text-blue-400" href="https://linktr.ee/abdibrokhim/" target="_blank" rel="noreferrer">All socials</a>
              </li>
            </ul>
          </div>
          <div className="text-white pl-2 mt-4">
            <div className="text-md">Business inquiries</div>
            <ul className="text-sm list-disc list-inside">
              <li>
                <a className="text-blue-400" href="mailto:abdibrokhim@gmail.com" target="_blank" rel="noreferrer">Email</a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    );
};