import { getLabels } from '../../lib/gsheet'

export default async function handler(req, res) {
  const labels = await getLabels()
  res.status(200).json(labels)
}