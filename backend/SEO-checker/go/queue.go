func publishJob(nc *nats.Conn, job JobPayload) error {
	data, _ := json.Marshal(job)

	// Publish to "scan-jobs" subject
	err := nc.Publish("scan-jobs", data)
	if err != nil {
		return err
	}

	// Store job metadata in Redis
	storeJobMetadata(job.ScanID, "queued")

	return nil
}