using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using PromptSharp.Domain.Entities;
using PromptSharp.Domain.Enums;

namespace PromptSharp.Infrastructure.Persistence.Configurations;

public sealed class ProjectConfiguration : IEntityTypeConfiguration<Project>
{
    public void Configure(EntityTypeBuilder<Project> builder)
    {
        builder.ToTable("Projects");
        builder.HasKey(project => project.Id);
        builder.Property(project => project.ProjectNumber).ValueGeneratedOnAdd();
        builder.Property(project => project.Idea).HasMaxLength(4000).IsRequired();
        builder.Property(project => project.Status).HasConversion<string>().HasMaxLength(40).IsRequired();
        builder.Property(project => project.GenerationStatus).HasConversion<string>().HasMaxLength(40).IsRequired();
        builder.Property(project => project.Estimate).HasMaxLength(80);
        builder.Property(project => project.Markdown);
        builder.Property(project => project.RawAiResponse);
        builder.Property(project => project.GenerationError).HasMaxLength(1000);
        builder.Property(project => project.SkillBundleVersion).HasMaxLength(128);
        builder.Property(project => project.SkillBundleHash).HasMaxLength(128);
        builder.Property(project => project.AzureDeploymentName).HasMaxLength(128);

        builder.HasIndex(project => new { project.UserId, project.CreatedAtUtc });
        builder.HasIndex(project => new { project.UserId, project.ProjectNumber }).IsUnique();
        builder.HasIndex(project => project.ProjectNumber).IsUnique();
        builder.HasIndex(project => new { project.UserId, project.Status });

        builder.HasOne(project => project.User)
            .WithMany(nameof(User.Projects))
            .HasForeignKey(project => project.UserId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasMany(project => project.Phases)
            .WithOne(phase => phase.Project)
            .HasForeignKey(phase => phase.ProjectId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.Metadata.FindNavigation(nameof(Project.Phases))?.SetPropertyAccessMode(PropertyAccessMode.Field);
    }
}
