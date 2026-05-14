namespace PromptSharp.Domain;

public sealed class Media
{
    private Media()
    {
    }

    private Media(Guid id, string url, string fileName, string contentType, long sizeBytes, Guid uploadedById, DateTimeOffset uploadedAt)
    {
        Id = id;
        Url = RequireText(url, nameof(url));
        FileName = RequireText(fileName, nameof(fileName));
        ContentType = RequireText(contentType, nameof(contentType));
        SizeBytes = sizeBytes > 0 ? sizeBytes : throw new DomainRuleException("Media size must be greater than zero.");
        UploadedById = uploadedById;
        UploadedAt = uploadedAt;
    }

    public Guid Id { get; private set; }

    public string Url { get; private set; } = string.Empty;

    public string FileName { get; private set; } = string.Empty;

    public string ContentType { get; private set; } = string.Empty;

    public long SizeBytes { get; private set; }

    public Guid UploadedById { get; private set; }

    public DateTimeOffset UploadedAt { get; private set; }

    public User? UploadedBy { get; private set; }

    public static Media Create(string url, string fileName, string contentType, long sizeBytes, Guid uploadedById, DateTimeOffset uploadedAt)
    {
        return new Media(Guid.NewGuid(), url, fileName, contentType, sizeBytes, uploadedById, uploadedAt);
    }

    private static string RequireText(string value, string name)
    {
        if (string.IsNullOrWhiteSpace(value))
        {
            throw new DomainRuleException($"{name} is required.");
        }

        return value.Trim();
    }
}
