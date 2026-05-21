import { Button } from '@/components/button'
import { Image } from '@/components/image'

export function ImageTextSplitBlock() {
  return (
    <section className="py-20 px-5 bg-[#F8F7F5]">
      <div className="wrapper mx-auto max-w-7xl">
        {/* Full Width Image */}
        <div className="relative w-full h-[200px] sm:h-[250px] md:h-[300px] lg:h-[350px] mb-16">
          <Image
            src="/workspace_bw.png"
            alt="Creative Workspace"
            fill
            className="object-cover grayscale"
          />
        </div>

        {/* Text Columns */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-4 items-start">
          {/* Left: Heading */}
          <div className="md:col-span-5">
            <h2 className="heading-2 text-[2.5rem] md:text-[3rem] lg:text-[3.5rem] text-black">
              Our Brand
              <br />
              Core Values
            </h2>
          </div>

          {/* Right: Paragraph & Link */}
          <div className="md:col-span-7 flex flex-col gap-8 md:pl-10">
            <p className="font-body text-black/60 max-w-[600px]">
              Poor user experience doesn't just frustrate customers—it bleeds
              revenue. Learn how integrating design thinking into your
              development process reduces technical debt, speeds up iterations,
              and creates products users actually love.
            </p>
            <div>
              <Button
                url="/about"
                variant="tertiary"
                color="neutral"
                size="sm"
                hasIcon={true}
              >
                Know Us More
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
