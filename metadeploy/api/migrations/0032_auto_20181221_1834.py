# Generated by Django 2.1.4 on 2018-12-21 18:34

import sfdo_template_helpers.fields
from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [("api", "0031_merge_20181221_1834")]

    operations = [
        migrations.AlterField(
            model_name="allowedlist",
            name="description",
            field=sfdo_template_helpers.fields.MarkdownField(
                blank=True, property_suffix="_markdown"
            ),
        ),
        migrations.AlterField(
            model_name="product",
            name="description",
            field=sfdo_template_helpers.fields.MarkdownField(
                property_suffix="_markdown"
            ),
        ),
    ]
