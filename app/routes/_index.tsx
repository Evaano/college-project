import { Paper } from "@mantine/core";
import type { MetaFunction } from "@remix-run/node";
import { Link } from "@remix-run/react";
import { SimpleGrid } from '@mantine/core';

import { useOptionalUser } from "~/utils";

export const meta: MetaFunction = () => [{ title: "Remix Notes" }];

export default function Index() {
  const user = useOptionalUser();
  return (
    <Paper className="relative min-h-screen bg-white sm:flex sm:items-center sm:justify-center snap-y snap-mandatory h-screen w-screen overflow-x-hidden">
      <div className="relative sm:pb-16 sm:pt-8 snap-start ">
        <div className="mx-auto max-w-7xl sm:px-6 lg:px-8 ">
          <div className="relative shadow-xl sm:overflow-hidden sm:rounded-2xl">
            <div className="absolute inset-0 ">
              <img
                className="h-full w-full object-cover"
                
                
              />
              <div className="absolute inset-0 bg-[color:rgba(220,246,248)]" />
            </div>
            <div className="relative px-4 pb-8 pt-16 sm:px-6 sm:pb-14 sm:pt-24 lg:px-8 lg:pb-20 lg:pt-32">
              <h1 className="text-center text-6xl font-extrabold tracking-tight sm:text-8xl lg:text-9xl">
                <span className="block uppercase text-custom-blue drop-shadow-md">
                  Event Hub
                </span>
              </h1>
              <p className="relative pb-8 text-center text-black font-extrabold lg:text-2xl">
                Never miss out again.
              </p>
              
              <div className="mx-auto mt-20 max-w-sm sm:flex sm:max-w-none sm:justify-center">
                {user ? (
                  <Link
                    to="/notes"
                    className="flex items-center justify-center rounded-md border border-transparent bg-white px-4 py-3 text-base font-medium text-blue-700 shadow-sm hover:bg-blue-50 sm:px-10"
                  >
                    View Notes for {user.email}
                  </Link>
                ) : (
                  <div className="space-y-4 sm:mx-auto sm:inline-grid sm:grid-cols-2 sm:gap-5 sm:space-y-0">
                    <Link
                      to="/join"
                      className="flex items-center justify-center rounded-md border border-transparent bg-[color:rgba(26,124,129)] px-4 py-3 text-base font-medium text-white shadow-sm hover:bg-blue-500 sm:px-8"
                    >
                      Sign up
                    </Link>
                    <Link
                      to="/login"
                      className="flex items-center justify-center rounded-md bg-custom-blue px-4 py-3 font-medium text-white hover:bg-blue-600"
                    >
                      Log In
                    </Link>
                  </div>
                  
                )}
              </div>
              
            </div>
          </div>
        </div>

        <div className="mx-auto max-w-7xl px-4 py-2 sm:px-6 lg:px-8">
          <div className="relative mt-5 bg-white sm:flex sm:items-center sm:justify-center">
            <h2>Sponsored By</h2>
          </div>
          <div className="mt-6 flex flex-wrap justify-center gap-8 mb-50">
            {[
              {
                src: "https://user-images.githubusercontent.com/1500684/157764397-ccd8ea10-b8aa-4772-a99b-35de937319e1.svg",
                alt: "Fly.io",
                href: "https://fly.io"
              },
              
              {
                src: "https://cdn.worldvectorlogo.com/logos/ooredoo-2.svg",
                alt: "Ooredoo",
                href: "https://www.ooredoo.mv"
              },
              {
                src: "https://user-images.githubusercontent.com/1500684/157772662-92b0dd3a-453f-4d18-b8be-9fa6efde52cf.png",
                alt: "Testing Library",
                href: "https://testing-library.com"
              },
              {
                src: "https://user-images.githubusercontent.com/1500684/157772934-ce0a943d-e9d0-40f8-97f3-f464c0811643.svg",
                alt: "Prettier",
                href: "https://prettier.io"
              },
              {
                src: "https://user-images.githubusercontent.com/1500684/157772990-3968ff7c-b551-4c55-a25c-046a32709a8e.svg",
                alt: "ESLint",
                href: "https://eslint.org"
              },
              {
                src: "https://user-images.githubusercontent.com/1500684/157773063-20a0ed64-b9f8-4e0b-9d1e-0b65a3d4a6db.svg",
                alt: "TypeScript",
                href: "https://typescriptlang.org"
              }
            ].map((img) => (
              <a
                key={img.href}
                href={img.href}
                className="flex h-16 w-32 justify-center p-1 grayscale transition hover:grayscale-0 focus:grayscale-0"
              >
                <img alt={img.alt} src={img.src} className="object-contain" />
              </a>
            ))}
          </div>
                <div className="flex flex-wrap justify-center gap-12 p-20 mt-0 pb-0 ">
                <div className="border border-gray-300 rounded-lg p-2 w-[300px] h-[320px] flex flex-col justify-between snap-start">

                  <div>
                    <img src="https://www.specialevents.com/sites/specialevents.com/files/styles/article_featured_retina/public/88A4947%201_2.jpg?itok=CHxwyji-" alt="" className="object-cover object-center w-full h-[260px] rounded-lg mt-0" />
                  </div>
                    <p className="mt-2 text-center font-extrabold align-top">Ooreedoo Music Festival 2024</p>
                </div>

                <div className="border border-gray-300 rounded-lg p-2 w-[300px] h-[320px] flex flex-col justify-between">
                  <div>
                    <img src="https://stg-images.radio.com/aiu-media/EventsEventful1920x1080-776f3eb9-24a7-4cf3-9dd2-c5685c91864b.jpg?width=780&crop=8:5.1,offset-y0" alt="" className="object-cover object-center w-full h-[260px] rounded-lg mb-0" />
                  </div>
                  <p className="mt-2 text-center font-extrabold align-top">Ooreedoo Music Festival 2024</p>
                </div>
                 
                <div className="border border-gray-300 rounded-lg p-2 w-[300px] h-[320px] flex flex-col justify-between">
                  <div>
                    <img src="https://cdn-www.oktopost.com/blog/wp-content/uploads/2018/11/ezra-comeau-jeffrey-77199-unsplash-2000x1200.jpg" alt="" className="object-cover object-center w-full h-[260px] rounded-lg mb-0" />
                  </div>
                  <p className="mt-2 text-center font-extrabold align-top">Ooreedoo Music Festival 2024</p>
                </div>
    
                <div className="border border-gray-300 rounded-lg p-2 w-[300px] h-[320px] flex flex-col justify-between">
                  <div>
                    <img src="https://pbs.twimg.com/media/C4ZYR8rUkAAqltE.jpg" alt="" className="object-cover object-center w-full h-[260px] rounded-lg mb-0" />
                  </div>
                  <p className="mt-2 text-center font-extrabold align-top">Ooreedoo Music Festival 2024</p>
                </div>
                
                <div className="border border-gray-300 rounded-lg p-2 w-[300px] h-[320px] flex flex-col justify-between">
                  <div>
                    <img src="https://cdn-ionff.nitrocdn.com/NjIxyDDWSMmBjcltbkwtwXYdlbVPzagP/assets/images/optimized/rev-80f38c0/savinggraceevents.co.uk/wp-content/uploads/2023/01/5-Guys-Dubrovnik-2-212-scaled.jpg" alt="" className="object-cover object-center w-full h-[260px] rounded-lg mb-0" />
                  </div>
                  <p className="mt-2 text-center font-extrabold align-topr">Super Cool Event Fr</p>
                </div>
                <div className="border border-gray-300 rounded-lg p-2 w-[300px] h-[320px] flex flex-col justify-between">
                  <div>
                    <img src="https://www.hdc.mv/app/files//2024/01/sksks-4-728x485.jpg" alt="" className="object-cover object-center w-full h-[260px] rounded-lg mb-0" />
                  </div>
                  <p className="mt-2 text-center font-extrabold align-top">Ooreedoo Music Festival 2024</p>
                </div>
                
                

                <div className="space-y-4 sm:mx-auto sm:inline-grid sm:grid-cols-1 sm:gap-5 sm:space-y-0 pt-5 pb-0 ">
                    <Link
                      to="/join"
                      className="flex items-center justify-center rounded-md border border-transparent bg-[color:rgba(26,124,129)] px-4 py-3 text-base font-medium text-white shadow-sm hover:bg-blue-500 sm:px-8"
                    >
                      See More
                    </Link>
                </div>
          </div>
        </div>
      </div>
    </Paper>
  );
}
