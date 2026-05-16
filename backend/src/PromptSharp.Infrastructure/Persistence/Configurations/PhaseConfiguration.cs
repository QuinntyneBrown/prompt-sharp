using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using PromptSharp.Domain.Entities;

namespace PromptSharp.Infrastructure.Persistence.Configurations;

public sealed class PhaseConfiguration : IEntityTypeConfiguration<Phase>
{
    public void Configure(EntityTypeBuilder<Phase> builder)
    {
        builder.ToTable("Phases");
        builder.HasKey(phase => phase.Id);
        builder.Property(phase => phase.Order).IsRequired();
        builder.Property(phase => phase.Title).HasMaxLength(160).IsRequired();

        builder.HasIndex(phase => new { phase.ProjectId, phase.Order }).IsUnique();

        builder.HasMany(phase => phase.Prompts)
            .WithOne(prompt => prompt.Phase)
            .HasForeignKey(prompt => prompt.PhaseId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.Metadata.FindNavigation(nameof(Phase.Prompts))?.SetPropertyAccessMode(PropertyAccessMode.Field);
    }
}
