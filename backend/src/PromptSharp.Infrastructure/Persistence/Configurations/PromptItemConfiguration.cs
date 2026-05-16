using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using PromptSharp.Domain.Entities;

namespace PromptSharp.Infrastructure.Persistence.Configurations;

public sealed class PromptItemConfiguration : IEntityTypeConfiguration<PromptItem>
{
    public void Configure(EntityTypeBuilder<PromptItem> builder)
    {
        builder.ToTable("PromptItems");
        builder.HasKey(prompt => prompt.Id);
        builder.Property(prompt => prompt.Order).IsRequired();
        builder.Property(prompt => prompt.Title).HasMaxLength(220).IsRequired();
        builder.Property(prompt => prompt.Body).IsRequired();
        builder.Property(prompt => prompt.TagsJson).HasMaxLength(4000).IsRequired();

        builder.HasIndex(prompt => new { prompt.PhaseId, prompt.Order }).IsUnique();
    }
}
