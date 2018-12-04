# Generated by Django 2.1.4 on 2018-12-04 18:52

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [("api", "0021_plan_post_install_message")]

    operations = [
        migrations.AlterModelOptions(
            name="product", options={"ordering": ("order_key",)}
        ),
        migrations.AlterModelOptions(
            name="productcategory",
            options={
                "ordering": ("order_key",),
                "verbose_name_plural": "product categories",
            },
        ),
        migrations.AddField(
            model_name="product",
            name="order_key",
            field=models.PositiveIntegerField(default=0),
        ),
        migrations.AddField(
            model_name="productcategory",
            name="order_key",
            field=models.PositiveIntegerField(default=0),
        ),
    ]
