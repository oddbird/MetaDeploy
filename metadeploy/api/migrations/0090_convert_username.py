# Generated by Django 2.2.16 on 2020-10-07 15:28

from django.db import migrations


def forwards(apps, schema_editor):
    SocialAccount = apps.get_model("socialaccount", "SocialAccount")

    # convert username from SF username to orgid_userid
    for account in SocialAccount.objects.iterator():
        data = account.extra_data
        if not account.user.is_staff:
            username = f"{data['organization_id']}_{data['user_id']}"
            account.user.username = username
            account.user.save()


def backwards(apps, schema_editor):
    SocialAccount = apps.get_model("socialaccount", "SocialAccount")

    # convert username from orgid_userid to SF username
    for account in SocialAccount.objects.iterator():
        data = account.extra_data
        account.user.username = data["preferred_username"]
        account.user.save()


class Migration(migrations.Migration):

    dependencies = [
        ("api", "0089_nullable_user"),
    ]

    operations = [migrations.RunPython(forwards, backwards)]
