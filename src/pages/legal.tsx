import { Stack } from '@mantine/core'
import Head from 'next/head'
import ReactMarkdown from 'react-markdown'
import { defaultColors } from '../theme/colors'

const contactEmail = process.env.CONTACT_EMAIL || 'contact@example.com'

export const text = `
# Legal

**Last updated: 10/30/2022**

Let's keep this short and sweet ❤️

- If you use Document That, you agree to the Terms of Use and Privacy Policy.
- To use Document That, you need to be 18 or older. 
- If we make a significant change to this policy, we will let you know via email.
- If you want to contact us about something, such as this Terms of Use or Privacy Policy, email ${contactEmail}.

## Terms of Use

- You cannot use Document That in a way that infringes upon the rights of others, or in any way that is illegal, threatening, fraudulent, or harmful. 
- We reserve the right to refuse service and terminate accounts on this hosted service at our sole discretion.
- Document That is intended for informational purposes only. That means a couple of things. One, we are not a substitute for a doctor. Two, some of our information, like the calorie count of a given food, may be wrong, despite our best effort to ensure accuracy. 
- Document That may offer an API. You can use this API as long as it is for personal, non-commercial use and you do not violate any technical limitations. For example, rate limiting, excessive bandwidth consumption, etc. In short, be a good digital citizen.

## Privacy

- Document That collects only the minimum data required to operate:

  - The data you explicitly provide. That data is stored on the server that serves Document That. For example, app.cleanslate.sh is hosted on [Render.com](https://render.com/privacy). If this instance of Document That is self-hosted, in may be in a different location. Email your host at ${contactEmail} for details.
  - The data needed to handle bugs. That data is stored in [Honeybadger.io](https://www.honeybadger.io/privacy/).

- Document That will never sell your data to a third-party.
- Document That will never share your data with a third-party, unless it is for a required service listed above or it is for a feature for which you have given your consent. For example, sharing your logs with a partner.
- Document That may send you a newsletter or marketing email. You can unsubscribe from all of these emails with one click and never hear from us again.
- To support our costs, Document That may adopt initiatives such as advertisements, sponsored posts, or affiliate marketing. All of these will be clearly marked as such and will not infringe on your privacy via targeting. In other words, every user of Document That will see the exact same content.
- If you want to delete your data, delete your account through the Document That interface. All your data will be deleted instantly!
- If you have any other questions about your data, or wish to download it, email ${contactEmail}.
`

const Privacy = () => {
  return (
    <Stack
      sx={{
        backgroundColor: defaultColors.background,
        h1: {
          fontWeight: 900,
        },
        'h1, h2': {
          margin: '5px 0px',
        },
        li: {
          margin: '5px 0px',
        },
        margin: '0px auto',
        'p, ul': {
          margin: 0,
        },
        paddingBottom: 50,
        width: '100%',
      }}
    >
      <Head>
        <title>Document That | Legal</title>
      </Head>
      <Stack
        sx={{ margin: '0px auto', marginTop: 30, maxWidth: 700, width: '90%' }}
      >
        {/* eslint-disable-next-line react/no-children-prop */}
        <ReactMarkdown children={text} />
      </Stack>
    </Stack>
  )
}

export default Privacy
