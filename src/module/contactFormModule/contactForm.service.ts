import { appSource } from "../../core/db";
import { ValidationException } from "../../core/exception";
import { ContactFormDto, ContactFormDtoValidation } from "./contactForm.dto";
import { contactDetails } from "./contactForm.model";
import { Request, Response } from "express";
import nodemailer from "nodemailer";

export const addContactFormDetails = async (req: Request, res: Response) => {
  const payload: ContactFormDto = req.body;
  const contactFormRepository = appSource.getRepository(contactDetails);

  try {
    // Validate input using your DTO validation schema
    const validation = ContactFormDtoValidation.validate(payload);
    if (validation.error) {
      throw new ValidationException(validation.error.message);
    }

    // Save validated data to DB
    await contactFormRepository.save(payload);

    return res.status(200).send({
      message: "Contact form submitted successfully",
    });

  } catch (error) {
    if (error instanceof ValidationException) {
      return res.status(400).send({
        message: error.message,
      });
    }

    return res.status(500).send({
      message: "Internal server error",
    });
  }
};

export const sendMail = async (req: Request, res: Response) => {
  try {
    const { name, company, phone, email, query } = req.body;

    // Map frontend fields to DB entity fields
    const contactFormRepository = appSource.getRepository(contactDetails);
    const formEntry = contactFormRepository.create({
      customer_name: name,
      customer_company: company,
      mobileNumber: phone,
      e_mail: email,
      message: query,
    });

    await contactFormRepository.save(formEntry);

    const transporter = nodemailer.createTransport({
      service: "gmail",
      port: 465,
      secure: true,
      auth: {
        user: "savedataakshaya03@gmail.com",
        pass: "xyvs iqyg bonl mtjr", // Ideally store in .env
      },
    });

    await transporter.sendMail({
      from: "support@sparrowsystems.in",
      to: "savedataakshaya03@gmail.com",
      subject: `New Inquiry from ${name}`,
      html: `
        <h2>New Inquiry Received</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Company:</strong> ${company}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong><br>${query}</p>
      `,
    });

    return res.status(200).send({
      message: "Form submitted and mail sent successfully",
    });
  } catch (error) {
    return res.status(500).send({
      message: "Internal Server Error",
    });
  }
};

