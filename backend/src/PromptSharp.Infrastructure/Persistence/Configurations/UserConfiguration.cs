using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using PromptSharp.Domain.Entities;

namespace PromptSharp.Infrastructure.Persistence.Configurations;

public sealed class UserConfiguration : IEntityTypeConfiguration<User>
{
    public void Configure(EntityTypeBuilder<User> builder)
    {
        builder.ToTable("Users");
        builder.HasKey(user => user.Id);
        builder.Property(user => user.Email).HasMaxLength(320).IsRequired();
        builder.Property(user => user.NormalizedEmail).HasMaxLength(320).IsRequired();
        builder.Property(user => user.DisplayName).HasMaxLength(160).IsRequired();
        builder.Property(user => user.PasswordHash).HasMaxLength(2048).IsRequired();
        builder.Property(user => user.PlanName).HasMaxLength(80).IsRequired();
        builder.Property(user => user.MonthlyProjectQuota).IsRequired();
        builder.Property(user => user.LastUserAgent).HasMaxLength(512);

        builder.HasIndex(user => user.NormalizedEmail)
            .IsUnique()
            .HasFilter("[DeletedAtUtc] IS NULL");

        builder.Metadata.FindNavigation(nameof(User.Projects))?.SetPropertyAccessMode(PropertyAccessMode.Field);
        builder.Metadata.FindNavigation(nameof(User.RefreshTokens))?.SetPropertyAccessMode(PropertyAccessMode.Field);
    }
}
